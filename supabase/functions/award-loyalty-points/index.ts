import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { orderId, userId, totalAmount, reason = 'Order completed' } = await req.json()

    if (!orderId || !userId || !totalAmount) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get user's loyalty profile with tier info
    const { data: loyaltyData, error: loyaltyError } = await supabase
      .from('user_loyalty')
      .select(`
        total_points,
        available_points,
        lifetime_spent,
        loyalty_tiers (
          benefits
        )
      `)
      .eq('user_id', userId)
      .single()

    if (loyaltyError) {
      console.error('Error fetching loyalty data:', loyaltyError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch loyalty data' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Calculate base points (1 point per dollar)
    const basePoints = Math.floor(totalAmount)
    
    // Apply tier multiplier
    const multiplier = (loyaltyData.loyalty_tiers?.benefits as any)?.multiplier || 1
    const earnedPoints = Math.floor(basePoints * multiplier)

    // Create points transaction
    const { error: transactionError } = await supabase
      .from('points_transactions')
      .insert({
        user_id: userId,
        points: earnedPoints,
        transaction_type: 'earned',
        reason,
        order_id: orderId
      })

    if (transactionError) {
      console.error('Error creating transaction:', transactionError)
      return new Response(
        JSON.stringify({ error: 'Failed to create transaction' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Update user loyalty totals
    const newTotalPoints = loyaltyData.total_points + earnedPoints
    const newAvailablePoints = loyaltyData.available_points + earnedPoints
    const newLifetimeSpent = loyaltyData.lifetime_spent + totalAmount

    // Check for tier upgrade
    const { data: tiers } = await supabase
      .from('loyalty_tiers')
      .select('id, name, minimum_points')
      .lte('minimum_points', newTotalPoints)
      .order('minimum_points', { ascending: false })
      .limit(1)

    const newTierId = tiers?.[0]?.id

    const { error: updateError } = await supabase
      .from('user_loyalty')
      .update({
        total_points: newTotalPoints,
        available_points: newAvailablePoints,
        lifetime_spent: newLifetimeSpent,
        ...(newTierId && { tier_id: newTierId })
      })
      .eq('user_id', userId)

    if (updateError) {
      console.error('Error updating loyalty data:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update loyalty data' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if tier was upgraded
    const tierUpgraded = tiers?.[0]?.name !== loyaltyData.loyalty_tiers?.name

    return new Response(
      JSON.stringify({
        success: true,
        pointsEarned: earnedPoints,
        newTotalPoints,
        newAvailablePoints,
        tierUpgraded,
        newTierName: tiers?.[0]?.name
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in award-loyalty-points function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})