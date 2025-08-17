import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.5";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  console.log("Opt-out function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return new Response(
        `<!DOCTYPE html>
        <html>
        <head>
          <title>Invalid Opt-out Link</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
            .error { color: #dc3545; }
          </style>
        </head>
        <body>
          <h1 class="error">Invalid Opt-out Link</h1>
          <p>The opt-out link you clicked is invalid or has expired.</p>
          <p>If you continue to receive unwanted emails, please contact our support team.</p>
        </body>
        </html>`,
        { 
          status: 400, 
          headers: { "Content-Type": "text/html", ...corsHeaders } 
        }
      );
    }

    // Find and update the cart with the opt-out token
    const { data: cart, error } = await supabase
      .from("abandoned_carts")
      .select("id, guest_email")
      .eq("opt_out_token", token)
      .single();

    if (error || !cart) {
      console.error("Cart not found for token:", token);
      return new Response(
        `<!DOCTYPE html>
        <html>
        <head>
          <title>Opt-out Link Not Found</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
            .error { color: #dc3545; }
          </style>
        </head>
        <body>
          <h1 class="error">Opt-out Link Not Found</h1>
          <p>The opt-out link you clicked could not be found or has already been used.</p>
          <p>If you continue to receive unwanted emails, please contact our support team.</p>
        </body>
        </html>`,
        { 
          status: 404, 
          headers: { "Content-Type": "text/html", ...corsHeaders } 
        }
      );
    }

    // Mark as opted out
    const { error: updateError } = await supabase
      .from("abandoned_carts")
      .update({ opted_out: true })
      .eq("opt_out_token", token);

    if (updateError) {
      console.error("Error updating opt-out status:", updateError);
      throw updateError;
    }

    console.log(`Successfully opted out email: ${cart.guest_email}`);

    // Return success page
    return new Response(
      `<!DOCTYPE html>
      <html>
      <head>
        <title>Successfully Unsubscribed</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { 
            font-family: Arial, sans-serif; 
            max-width: 600px; 
            margin: 50px auto; 
            padding: 20px; 
            text-align: center; 
            background: #f8f9fa;
          }
          .success { 
            color: #28a745; 
            background: white; 
            padding: 40px; 
            border-radius: 8px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .checkmark {
            font-size: 48px;
            color: #28a745;
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <div class="success">
          <div class="checkmark">✓</div>
          <h1>Successfully Unsubscribed</h1>
          <p>You have been successfully unsubscribed from abandoned cart emails.</p>
          <p>You will no longer receive reminders about items left in your cart.</p>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            If you change your mind, you can always opt back in by adding items to your cart again.
          </p>
        </div>
      </body>
      </html>`,
      { 
        status: 200, 
        headers: { "Content-Type": "text/html", ...corsHeaders } 
      }
    );

  } catch (error: any) {
    console.error("Error in handle-opt-out function:", error);
    return new Response(
      `<!DOCTYPE html>
      <html>
      <head>
        <title>Error</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
          .error { color: #dc3545; }
        </style>
      </head>
      <body>
        <h1 class="error">Something went wrong</h1>
        <p>We encountered an error while processing your request.</p>
        <p>Please try again later or contact our support team.</p>
      </body>
      </html>`,
      { 
        status: 500, 
        headers: { "Content-Type": "text/html", ...corsHeaders } 
      }
    );
  }
};

serve(handler);