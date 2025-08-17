import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.5";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AbandonedCartEmailRequest {
  cartId: string;
  reminderType: "first" | "second";
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Abandoned cart email function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { cartId, reminderType }: AbandonedCartEmailRequest = await req.json();
    console.log(`Processing ${reminderType} reminder for cart ${cartId}`);

    // Fetch abandoned cart details
    const { data: cart, error: cartError } = await supabase
      .from("abandoned_carts")
      .select(`
        *,
        venues (
          name,
          address
        )
      `)
      .eq("id", cartId)
      .eq("opted_out", false)
      .single();

    if (cartError || !cart) {
      console.error("Cart not found or error:", cartError);
      return new Response(
        JSON.stringify({ error: "Cart not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!cart.guest_email) {
      console.log("No email address for cart");
      return new Response(
        JSON.stringify({ error: "No email address" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Generate opt-out token if not exists
    let optOutToken = cart.opt_out_token;
    if (!optOutToken) {
      const { data: tokenData } = await supabase.rpc("generate_opt_out_token");
      optOutToken = tokenData;
      
      await supabase
        .from("abandoned_carts")
        .update({ opt_out_token: optOutToken })
        .eq("id", cartId);
    }

    // Create email content based on reminder type
    const baseUrl = Deno.env.get("SITE_URL") || "https://lovable.app";
    const resumeUrl = `${baseUrl}/checkout?cart=${cartId}`;
    const optOutUrl = `${baseUrl}/opt-out?token=${optOutToken}`;

    let subject: string;
    let emailContent: string;

    if (reminderType === "first") {
      subject = "You left something delicious behind! 🍹";
      emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Don't forget your drinks!</h1>
          <p>Hi there!</p>
          <p>We noticed you had some amazing drinks in your cart at <strong>${cart.venues?.name}</strong> but didn't complete your order.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Your Cart (${cart.cart_data.length} items) - $${Number(cart.total_amount).toFixed(2)}</h3>
            ${cart.cart_data.map((item: any) => `
              <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                <strong>${item.product.name}</strong> x${item.quantity} - $${(item.product.price * item.quantity).toFixed(2)}
              </div>
            `).join('')}
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${resumeUrl}" style="background: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Complete Your Order
            </a>
          </div>

          <p style="color: #666; font-size: 14px;">
            Your cart will be saved for 24 hours. After that, you'll need to start over.
          </p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            Don't want these emails? <a href="${optOutUrl}" style="color: #007bff;">Unsubscribe here</a>
          </p>
        </div>
      `;
    } else {
      subject = "Last chance! Your cart expires soon ⏰";
      emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc3545; text-align: center;">⏰ Last Chance!</h1>
          <p>Hi there!</p>
          <p><strong>Your cart at ${cart.venues?.name} will expire soon!</strong></p>
          <p>Don't miss out on these delicious drinks you selected:</p>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #856404;">Expires Soon! (${cart.cart_data.length} items) - $${Number(cart.total_amount).toFixed(2)}</h3>
            ${cart.cart_data.map((item: any) => `
              <div style="border-bottom: 1px solid #f8d7da; padding: 10px 0;">
                <strong>${item.product.name}</strong> x${item.quantity} - $${(item.product.price * item.quantity).toFixed(2)}
              </div>
            `).join('')}
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${resumeUrl}" style="background: #dc3545; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              🚨 Complete Order Now
            </a>
          </div>

          <p style="color: #721c24; font-weight: bold; text-align: center;">
            Act fast - your cart will be deleted soon!
          </p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            Don't want these emails? <a href="${optOutUrl}" style="color: #007bff;">Unsubscribe here</a>
          </p>
        </div>
      `;
    }

    // Send email
    const emailResponse = await resend.emails.send({
      from: "Your Bar <noreply@resend.dev>",
      to: [cart.guest_email],
      subject,
      html: emailContent,
    });

    console.log("Email sent successfully:", emailResponse);

    // Update the cart with reminder sent timestamp
    const updateField = reminderType === "first" ? "first_reminder_sent_at" : "second_reminder_sent_at";
    await supabase
      .from("abandoned_carts")
      .update({ [updateField]: new Date().toISOString() })
      .eq("id", cartId);

    return new Response(
      JSON.stringify({ success: true, emailId: emailResponse.data?.id }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error in send-abandoned-cart-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);