-- Add sample fine print and allergy information to some products for testing
UPDATE public.products 
SET fine_print = 'Please drink responsibly. Must be 21+ to purchase alcohol. No refunds on alcoholic beverages. Served in a chilled glass with salt rim.',
    allergy_information = 'Contains lime juice. May contain traces of gluten from processing equipment. Please inform staff of any allergies.'
WHERE name = 'Classic Margarita';

UPDATE public.products 
SET fine_print = 'Premium aged whiskey served neat or on the rocks. Must be 21+ to purchase. Each serving is carefully measured.',
    allergy_information = 'Contains alcohol. Made from grain. May contain traces of sulfites. Please consult with staff about allergen concerns.'
WHERE name = 'Old Fashioned';

UPDATE public.products 
SET fine_print = 'Locally brewed craft beer. Must be 21+ to purchase. Best served chilled between 38-42°F.',
    allergy_information = 'Contains gluten, barley, hops. May contain traces of wheat. Not suitable for those with celiac disease.'
WHERE name = 'IPA - Local Craft';