------rpc


create or replace function public.create_job(template_id uuid)
returns uuid
as $$
declare
  new_job_id uuid;
begin
  if not exists(
    select 1 from public.templates
    where id = template_id
  )then
    raise exception 'Template does not exist';
  end if;

  insert into public.jobs(user_id, template_id, status)
  values(auth.uid(),template_id, 'created')
  returning id into new_job_id;

  return new_job_id;
end;
$$ language plpgsql security definer;


create or replace function public.update_job_status(
  job_id uuid,
  new_status job_status,
  error_msg text default null
)
returns void
as $$
begin
  -- Authorization check
  if not exists (
    select 1
    from public.jobs
    where id = job_id
  ) then
    raise exception 'Unauthorized job access';
  end if;

  -- If failed, error message is required
  if new_status = 'failed' and error_msg is null then
    raise exception 'error_msg is required when status is failed';
  end if;

  update public.jobs
  set
    status = new_status,
    error_message = case
      when new_status = 'failed' then error_msg
      else null
    end,
    updated_at = now()
  where id = job_id;
end;
$$ language plpgsql security definer;

