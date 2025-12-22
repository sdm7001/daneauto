import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendEmailRequest {
  subject: string;
  body: string;
  recipient_emails?: string[];
  send_to_all?: boolean;
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Send email function called");
    
    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header");
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify user and check admin role
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      console.error("User auth error:", userError);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user is admin
    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (roleError || !roleData) {
      console.error("Role check failed:", roleError);
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { subject, body, recipient_emails, send_to_all }: SendEmailRequest = await req.json();

    if (!subject || !body) {
      return new Response(
        JSON.stringify({ error: "Subject and body are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let emails: string[] = [];

    if (send_to_all) {
      // Get all user emails from auth.users via profiles
      const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
      
      if (usersError) {
        console.error("Error fetching users:", usersError);
        return new Response(
          JSON.stringify({ error: "Failed to fetch users" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      emails = users.users.map(u => u.email).filter(Boolean) as string[];
    } else if (recipient_emails && recipient_emails.length > 0) {
      emails = recipient_emails;
    } else {
      return new Response(
        JSON.stringify({ error: "No recipients specified" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Sending email to ${emails.length} recipients`);

    // Send emails in batches (Resend allows up to 100 per request)
    const batchSize = 50;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      
      try {
        const { error: sendError } = await resend.emails.send({
          from: "Dane Auto Parts <onboarding@resend.dev>",
          to: batch,
          subject: subject,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: #1a1f2e; color: #4ecdc4; padding: 20px; text-align: center; }
                  .content { padding: 20px; background: #f9f9f9; }
                  .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>Dane Auto Parts Ltd</h1>
                  </div>
                  <div class="content">
                    ${body.replace(/\n/g, '<br>')}
                  </div>
                  <div class="footer">
                    <p>You received this email because you're a registered user of Dane Auto Parts Ltd.</p>
                    <p>123 Auto Parts Drive, Industrial District, NY 10001</p>
                  </div>
                </div>
              </body>
            </html>
          `,
        });

        if (sendError) {
          console.error("Batch send error:", sendError);
          errorCount += batch.length;
        } else {
          successCount += batch.length;
        }
      } catch (batchError) {
        console.error("Batch error:", batchError);
        errorCount += batch.length;
      }
    }

    // Log the email send
    await supabase.from("email_logs").insert({
      sent_by: user.id,
      subject,
      body,
      recipient_count: successCount,
      status: errorCount > 0 ? "partial" : "sent",
    });

    console.log(`Email sent: ${successCount} success, ${errorCount} errors`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent: successCount, 
        errors: errorCount 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
