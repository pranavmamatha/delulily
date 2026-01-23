--policies for storage buckets
--templates bucket
create policy "allow authenticated read"
on storage.objects
for select
using (
  bucket_id = 'templates'
  and auth.role() = 'authenticated'
);
--jobs bucket
CREATE POLICY "Allow user uploads" 
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'jobs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Allow user reads"
ON storage.objects FOR SELECT TO authenticated  
USING (
  bucket_id = 'jobs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
