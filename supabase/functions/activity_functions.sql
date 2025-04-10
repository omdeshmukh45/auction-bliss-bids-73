
-- Create RPC functions to handle activity logging without TypeScript errors

-- Function for logging user activity
CREATE OR REPLACE FUNCTION public.insert_user_activity_log(
  p_user_id UUID,
  p_activity_type TEXT,
  p_details JSONB DEFAULT '{}',
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
) RETURNS UUID
LANGUAGE SQL
SECURITY DEFINER
AS $$
  INSERT INTO public.user_activity_logs (
    user_id, 
    activity_type, 
    details, 
    ip_address, 
    user_agent
  ) VALUES (
    p_user_id, 
    p_activity_type, 
    p_details, 
    p_ip_address, 
    p_user_agent
  )
  RETURNING id;
$$;

-- Function for logging product activity
CREATE OR REPLACE FUNCTION public.log_product_activity(
  p_user_id UUID,
  p_activity_type TEXT,
  p_resource_id UUID,
  p_resource_type TEXT,
  p_details JSONB DEFAULT '{}'
) RETURNS UUID
LANGUAGE SQL
SECURITY DEFINER
AS $$
  INSERT INTO public.activity_logs (
    user_id, 
    activity_type, 
    resource_id, 
    resource_type, 
    details
  ) VALUES (
    p_user_id, 
    p_activity_type, 
    p_resource_id, 
    p_resource_type, 
    p_details
  )
  RETURNING id;
$$;
