-- Add sample fine print and allergy information to more featured products
UPDATE public.products 
SET fine_print = 'Premium wine selection. Must be 21+ to purchase. Wine may contain sulfites. Served at optimal temperature.',
    allergy_information = 'Contains sulfites. Made from grapes. May have been processed in facilities that handle nuts and wheat.'
WHERE name = 'Cabernet Sauvignon';

UPDATE public.products 
SET fine_print = 'Light and refreshing rosé wine. Must be 21+ to purchase. Best served chilled between 45-50°F.',
    allergy_information = 'Contains sulfites. Made from grapes. May contain traces of egg white used in fining process.'
WHERE name = 'Rosé';

UPDATE public.products 
SET fine_print = 'Fresh appetizer perfect for sharing. Served with our house-made sauces. Please allow 10-15 minutes for preparation.',
    allergy_information = 'Contains chicken, wheat (flour coating), eggs, milk. Cooked in oil that may process soy and tree nuts. Contains celery in sauce.'
WHERE name = 'Buffalo Wings';

UPDATE public.products 
SET fine_print = 'Generous portion perfect for sharing. Made with fresh ingredients and our signature cheese blend.',
    allergy_information = 'Contains milk (cheese), wheat (tortilla chips), may contain soy. Prepared in facility that processes tree nuts and peanuts.'
WHERE name = 'Loaded Nachos';