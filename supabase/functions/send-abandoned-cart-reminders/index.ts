import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.5";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  console.log("Abandoned cart reminders cron job started");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

    console.log("Checking for carts to send reminders...");

    // Find carts that need first reminder (5 minutes old, no first reminder sent)
    const { data: firstReminderCarts, error: firstError } = await supabase
      .from("abandoned_carts")
      .select("id, guest_email")
      .lte("created_at", fiveMinutesAgo.toISOString())
      .is("first_reminder_sent_at", null)
      .eq("opted_out", false)
      .eq("converted_to_order", false)
      .not("guest_email", "is", null);

    if (firstError) {
      console.error("Error fetching first reminder carts:", firstError);
    } else {
      console.log(`Found ${firstReminderCarts?.length || 0} carts for first reminder`);
      
      // Send first reminders
      for (const cart of firstReminderCarts || []) {
        try {
          const response = await supabase.functions.invoke("send-abandoned-cart-email", {
            body: {
              cartId: cart.id,
              reminderType: "first"
            }
          });
          
          if (response.error) {
            console.error(`Error sending first reminder for cart ${cart.id}:`, response.error);
          } else {
            console.log(`First reminder sent for cart ${cart.id}`);
          }
        } catch (error) {
          console.error(`Failed to send first reminder for cart ${cart.id}:`, error);
        }
      }
    }

    // Find carts that need second reminder (10 minutes old, first reminder sent, no second reminder sent)
    const { data: secondReminderCarts, error: secondError } = await supabase
      .from("abandoned_carts")
      .select("id, guest_email")
      .lte("created_at", tenMinutesAgo.toISOString())
      .not("first_reminder_sent_at", "is", null)
      .is("second_reminder_sent_at", null)
      .eq("opted_out", false)
      .eq("converted_to_order", false)
      .not("guest_email", "is", null);

    if (secondError) {
      console.error("Error fetching second reminder carts:", secondError);
    } else {
      console.log(`Found ${secondReminderCarts?.length || 0} carts for second reminder`);
      
      // Send second reminders
      for (const cart of secondReminderCarts || []) {
        try {
          const response = await supabase.functions.invoke("send-abandoned-cart-email", {
            body: {
              cartId: cart.id,
              reminderType: "second"
            }
          });
          
          if (response.error) {
            console.error(`Error sending second reminder for cart ${cart.id}:`, response.error);
          } else {
            console.log(`Second reminder sent for cart ${cart.id}`);
          }
        } catch (error) {
          console.error(`Failed to send second reminder for cart ${cart.id}:`, error);
        }
      }
    }

    // Clean up old carts (older than 24 hours)
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const { error: cleanupError } = await supabase
      .from("abandoned_carts")
      .delete()
      .lte("created_at", twentyFourHoursAgo.toISOString())
      .eq("converted_to_order", false);

    if (cleanupError) {
      console.error("Error cleaning up old carts:", cleanupError);
    } else {
      console.log("Cleaned up old abandoned carts");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        firstReminders: firstReminderCarts?.length || 0,
        secondReminders: secondReminderCarts?.length || 0,
        message: "Abandoned cart reminders processed successfully" 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error in send-abandoned-cart-reminders function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);