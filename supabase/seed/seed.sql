--Inserts into templates;
--Also push the images in the bucket
--templates/template-id/preview.png
--Only ".png" is allowed
INSERT INTO public.templates (name, prompt) VALUES
('Retro Anime',
'Transform the subject into a Japanese 1980s anime character with a retro-futuristic aesthetic. Use bold line art, slightly exaggerated facial features, and cel-shaded shadows typical of hand-drawn animation. Apply vibrant yet slightly desaturated colors and dramatic neon lighting. Place the character in a dynamic cyberpunk environment with subtle film grain, glowing signs, and atmospheric haze. The final image should feel like an iconic 80s sci-fi illustration: energetic, stylized, nostalgic, and fully hand-drawn.'
),

('Bollywood Poster',
'Transform the image into a vintage 1970s–1980s Bollywood movie poster illustrated in the iconic hand-painted Mumbai studio style. Use bold, saturated colors—crimson, saffron, turquoise, royal blue, and gold—applied with visible brushstrokes and textured paint grain. Render the subject with exaggerated dramatic expressions, heroic posture, and glowing highlights, reminiscent of classic film stars. Add wind-blown hair, dynamic fabric motion, and intense, romantic or action-driven poses typical of the era. Incorporate multiple painted vignettes around the main figure: smaller bust portraits in emotional expressions, dramatic angled close-ups, or action silhouettes. Add strong rim lighting, thick outlining, and theatrical shadowing for heightened drama. Include iconic Bollywood poster motifs such as sunbursts, smoke trails, painted flames, retro lens flares, or fading gradients. Enhance cultural authenticity with Indian fashion cues of the time—saree drapes, flowing dupattas, embroidered collars, gold jewelry, kohl-lined eyes, or a heroic kurta/sherwani look depending on the subject. Surround the composition with retro hand-painted typography: a bold, stylized film title in Hindi + English, classic block lettering, and distressed printing textures. The final artwork should feel nostalgic, loud, cinematic, and unmistakably like a vintage Bollywood poster from the golden era of 70s–80s Indian cinema.'
),

('Dramatic',
'Create a dramatic black-and-white headshot of the subject or subjects with a moody, cinematic atmosphere. Use high-contrast lighting that carves out the face with deep shadows and bright highlights. Make the subject appear wet, as if the subject has just been caught in the rain, with irregular water droplets and streaks across the cheeks, forehead, and jawline. Hair should look damp and slightly clumped, with a few strands falling naturally across the face. Keep the background dark and minimal so the illuminated features and droplets stand out. The overall look should feel intense, emotional, and photographic — a raw, expressive portrait with real rain texture and dramatic tonal depth.'
),

('Iconic',
'Using the uploaded image as reference, create a fine-art fashion editorial scene of a figure seated low on a minimalist metal stool, legs extended forward in a relaxed, grounded posture, feet planted evenly, one hand resting loosely between the knees holding thin leather reins, shoulders slightly slouched and head tilted downward in a calm, introspective pose; the subject wears dark oversized layered clothing, wide-leg trousers, leather boots, and dark sunglasses. A powerful black horse stands close behind the seated figure, aligned protectively and partially overlapping their silhouette. The setting is an open, natural landscape with sparse wild grasses and rounded forms beneath a bright, overexposed sky that creates strong negative space and high-contrast lighting. The overall look is cinematic and timeless, with soft highlights, matte texture, subtle film grain, and a monochrome fine-art aesthetic, evoking luxury fashion photography and editorial elegance.'
),

('Minimalist',
'Transform the subject(s) into a hyper-minimalist Indian designer campaign — monochrome kurta/sari shapes, clean background, high-fashion pose. Do not add any additional people or models. Do not add text.'
),

('Paparazzi',
'Transform the subject into a high-fashion press scrum photograph, surrounded tightly by cameras, microphones, and boom mics from all directions. Preserve the subject’s face, features, and overall identity clearly recognizable. The subject is centered in the frame, partially obscured by overlapping microphones and camera lenses pointing inward, creating a sense of pressure and attention. Expression is calm, controlled, and unreadable — confident but distant. Styling is minimal and fashion-forward: dark clothing, sharp silhouette, sunglasses or statement eyewear optional. The image is shot like a real editorial photograph — direct flash, harsh highlights, deep shadows, and realistic textures on equipment. Colors are cool and neutral, dominated by black, grey, and metallic tones. The composition feels claustrophobic and symmetrical, with the subject visually trapped by media attention. Style: paparazzi press swarm, fashion editorial photography, cinematic realism, high-contrast flash, modern celebrity moment.'
),

('Sketch',
'Generate an image from the uploaded photo that reimagines the subject as an ultra-detailed 3D graphite pencil sketch on textured white notebook paper. Emphasize crisp paper grain, subtle imperfections, and natural surface fibers. Show the subject actively drawing, with their hand holding a pencil as the sketch comes to life. Include an eraser, sharpener, and scattered pencil shavings resting on the page. Add realistic shadows, smudges, and fine graphite residue around the working area to reinforce the tactile, hand-drawn feel.'
),

('Flower Petals',
'Transform me into a figure made entirely from layered flower petals. Use realistic petal textures, delicate edges, and natural overlaps to form facial features and silhouette while keeping identity recognizable. Soft daylight, gentle shadows, and a clean minimal background. Photoreal, high-detail, elegant.'
),

('Desi Outfit',
'Transform the person in the uploaded photo into a full-length traditional Indian portrait while preserving their real face, skin tone, age, hairstyle shape, and natural expression exactly (no beautification). Place them in a neutral, relaxed full-body pose unrelated to the source image—standing straight with arms at the sides or a soft symmetrical stance with hands loosely near the front. Set the scene in a premium, minimal studio with a warm sand-toned textured backdrop, soft gradients, gentle diffused shadows, and warm ambient editorial lighting. Dress them in a fun, culturally authentic Indian outfit chosen from playful yet realistic options: a pastel chikankari kurta set, a handloom cotton or linen kurta with subtle jacquard texture, a bandhgala in muted jewel tones, or a vibrant saree (cotton, chanderi, banarasi, kanjeevaram, kota doria, ajrakh, or kalamkari) with a clean regional drape. Use lively but tasteful colors (ivory, saffron, aquamarine, soft pinks, pastel blues, muted jewel tones). Keep accessories minimal and natural (simple watch, bangles, studs, or jhumkas), simple mojaris or sandals if visible. Ensure true fabric realism—visible weave, embroidery depth, natural folds, correct drape and pleats—so it feels worn, joyful, and authentic, not costume-like.'
);
