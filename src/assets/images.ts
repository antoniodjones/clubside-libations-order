// Import all menu item images
import margarita from './cocktails/margarita.jpg';
import oldFashioned from './cocktails/old-fashioned.jpg';
import espressoMartini from './cocktails/espresso-martini.jpg';
import negroni from './cocktails/negroni.jpg';
import ipa from './beer/ipa.jpg';
import stout from './beer/stout.jpg';
import redWine from './wine/red-wine.jpg';
import whiteWine from './wine/white-wine.jpg';
import buffaloWings from './food/buffalo-wings.jpg';
import nachos from './food/nachos.jpg';
import mozzarellaSticks from './food/mozzarella-sticks.jpg';
import ribeyeSteak from './food/ribeye-steak.jpg';
import chocolateLavaCake from './food/chocolate-lava-cake.jpg';
import virginMojito from './mocktails/virgin-mojito.jpg';
import whiskey from './spirits/whiskey.jpg';

export const menuImages = {
  // Cocktails
  margarita,
  oldFashioned,
  espressoMartini,
  negroni,
  
  // Beer
  ipa,
  stout,
  
  // Wine
  redWine,
  whiteWine,
  
  // Food
  buffaloWings,
  nachos,
  mozzarellaSticks,
  ribeyeSteak,
  chocolateLavaCake,
  
  // Mocktails
  virginMojito,
  
  // Spirits
  whiskey,
};

// Mapping product names to images
export const productImageMap = {
  'Classic Margarita': margarita,
  'Old Fashioned': oldFashioned,
  'Espresso Martini': espressoMartini,
  'Negroni': negroni,
  'IPA - Local Craft': ipa,
  'Stout': stout,
  'Cabernet Sauvignon': redWine,
  'Pinot Noir': redWine,
  'Merlot': redWine,
  'Chardonnay': whiteWine,
  'Sauvignon Blanc': whiteWine,
  'Riesling': whiteWine,
  'Prosecco': whiteWine,
  'Rosé': whiteWine,
  'Buffalo Wings': buffaloWings,
  'Loaded Nachos': nachos,
  'Mozzarella Sticks': mozzarellaSticks,
  'Grilled Ribeye Steak': ribeyeSteak,
  'Chocolate Lava Cake': chocolateLavaCake,
  'Virgin Mojito': virginMojito,
  'Macallan 18': whiskey,
  'Jameson Irish Whiskey': whiskey,
  'Don Julio 1942': whiskey,
  'Hennessy VS': whiskey,
};