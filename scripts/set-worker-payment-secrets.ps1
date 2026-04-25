param(
  [Parameter(Mandatory = $true)]
  [string]$SupabaseServiceRoleKey,

  [Parameter(Mandatory = $true)]
  [string]$MpesaConsumerKey,

  [Parameter(Mandatory = $true)]
  [string]$MpesaConsumerSecret,

  [Parameter(Mandatory = $true)]
  [string]$MpesaShortcode,

  [Parameter(Mandatory = $true)]
  [string]$MpesaPasskey
)

$config = "workers/restock-request/wrangler.toml"

$SupabaseServiceRoleKey | npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY --config $config
$MpesaConsumerKey | npx wrangler secret put MPESA_CONSUMER_KEY --config $config
$MpesaConsumerSecret | npx wrangler secret put MPESA_CONSUMER_SECRET --config $config
$MpesaShortcode | npx wrangler secret put MPESA_SHORTCODE --config $config
$MpesaPasskey | npx wrangler secret put MPESA_PASSKEY --config $config

Write-Output "Worker payment secrets updated successfully."
