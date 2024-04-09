import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://trttfelnlikbvrmykuox.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydHRmZWxubGlrYnZybXlrdW94Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTkzNzEwNSwiZXhwIjoxOTk3NTEzMTA1fQ.hr58U_cHvKMPeiK4Bzj1r_eYjbrTZ1TZpvcCGcFJiAw',
)
