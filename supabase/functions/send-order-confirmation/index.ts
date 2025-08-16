import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.5";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderConfirmationRequest {
  orderId: string;
  email: string;
  isGuest?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, email, isGuest = false }: OrderConfirmationRequest = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        venues(name, address),
        order_items(
          quantity,
          unit_price,
          total_price,
          products(name, description)
        )
      `)
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      console.error('Error fetching order:', orderError);
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Generate order items HTML
    const orderItemsHtml = order.order_items.map((item: any) => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px; text-align: left;">
          <strong>${item.products.name}</strong>
          ${item.products.description ? `<br><small style="color: #666;">${item.products.description}</small>` : ''}
        </td>
        <td style="padding: 12px; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; text-align: right;">$${item.unit_price}</td>
        <td style="padding: 12px; text-align: right;"><strong>$${item.total_price}</strong></td>
      </tr>
    `).join('');

    // Create tracking link
    const trackingLink = `${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'lovableproject.com') || 'http://localhost:5173'}/track-order?id=${orderId}`;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Order Confirmed!</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Thank you for your order</p>
            </div>

            <!-- Order Summary -->
            <div style="padding: 30px;">
              <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                <h2 style="margin: 0 0 15px 0; color: #6366f1; font-size: 20px;">Order Details</h2>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                  <div>
                    <strong>Order ID:</strong><br>
                    <span style="font-family: monospace; background-color: #e9ecef; padding: 4px 8px; border-radius: 4px;">${order.id}</span>
                  </div>
                  <div>
                    <strong>Order Date:</strong><br>
                    ${new Date(order.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div>
                    <strong>Status:</strong><br>
                    <span style="background-color: #d4edda; color: #155724; padding: 4px 8px; border-radius: 4px; text-transform: capitalize;">${order.status}</span>
                  </div>
                  <div>
                    <strong>Total Amount:</strong><br>
                    <span style="font-size: 18px; font-weight: bold; color: #6366f1;">$${order.total_amount}</span>
                  </div>
                </div>
              </div>

              <!-- Venue Information -->
              <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                <h3 style="margin: 0 0 10px 0; color: #6366f1;">Pickup Location</h3>
                <p style="margin: 0; font-weight: bold;">${order.venues.name}</p>
                <p style="margin: 5px 0 0 0; color: #666;">${order.venues.address}</p>
              </div>

              <!-- Order Items -->
              <div style="margin-bottom: 25px;">
                <h3 style="margin: 0 0 15px 0; color: #6366f1;">Your Items</h3>
                <table style="width: 100%; border-collapse: collapse; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                  <thead>
                    <tr style="background-color: #6366f1; color: white;">
                      <th style="padding: 15px; text-align: left;">Item</th>
                      <th style="padding: 15px; text-align: center;">Qty</th>
                      <th style="padding: 15px; text-align: right;">Price</th>
                      <th style="padding: 15px; text-align: right;">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${orderItemsHtml}
                    <tr style="background-color: #f8f9fa; font-weight: bold;">
                      <td colspan="3" style="padding: 15px; text-align: right;">Order Total:</td>
                      <td style="padding: 15px; text-align: right; font-size: 18px; color: #6366f1;">$${order.total_amount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Track Order Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${trackingLink}" 
                   style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 2px 10px rgba(99, 102, 241, 0.3);">
                  Track Your Order
                </a>
              </div>

              ${isGuest ? `
                <!-- Guest Instructions -->
                <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 20px 0;">
                  <h4 style="margin: 0 0 10px 0; color: #856404;">📱 Important for Guests</h4>
                  <p style="margin: 0; color: #856404;">
                    Since you ordered as a guest, save this email or bookmark the tracking link above to check your order status. 
                    You can also visit our website and go to "Track Order" with your Order ID: <strong>${order.id}</strong>
                  </p>
                </div>
              ` : ''}

              <!-- Next Steps -->
              <div style="background-color: #e7f3ff; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h4 style="margin: 0 0 10px 0; color: #0066cc;">📋 What's Next?</h4>
                <ul style="margin: 0; padding-left: 20px; color: #0066cc;">
                  <li>We'll start preparing your order shortly</li>
                  <li>You'll receive updates as your order progresses</li>
                  <li>Pick up your order at the venue when ready</li>
                  <li>Use the tracking link above to monitor status</li>
                </ul>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                Questions about your order? Contact the venue directly or visit our support page.
              </p>
              <p style="margin: 10px 0 0 0; color: #999; font-size: 12px;">
                This email was sent because you placed an order with us. If you believe this was sent in error, please ignore this email.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send the email
    const emailResponse = await resend.emails.send({
      from: "Orders <orders@resend.dev>",
      to: [email],
      subject: `Order Confirmation - Order #${order.id.slice(0, 8)}`,
      html: emailHtml,
    });

    console.log("Order confirmation email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Order confirmation email sent successfully",
        orderId: order.id 
      }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-order-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);