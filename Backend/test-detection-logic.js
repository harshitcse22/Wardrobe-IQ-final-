// Test detection logic without actual upload

console.log('🧪 TESTING DETECTION LOGIC\n');
console.log('='.repeat(60));

const testFilenames = [
  'blue-jeans.jpg',
  'black-jeans.png',
  'red-shirt.jpg',
  'white-tshirt.png',
  'brown-shoes.jpg',
  'green-jacket.jpg',
  'image-1763648082996.jpg', // Multer generated name
  'IMG_1234.jpg', // Camera name
  'photo.png' // Generic name
];

function detectFromFilename(originalFilename) {
  const filename = originalFilename.toLowerCase();
  
  let type = 'shirt';
  let color = 'blue';
  let category = 'tops';
  let detectionMethod = 'default';
  
  console.log(`\n📁 Testing: "${originalFilename}"`);
  console.log(`   Lowercase: "${filename}"`);
  
  // Type detection
  if (filename.includes('jean') || filename.includes('denim')) {
    type = 'jeans';
    category = 'bottoms';
    detectionMethod = 'jeans_detected';
  } else if (filename.includes('dress')) {
    type = 'dress';
    category = 'dresses';
    detectionMethod = 'dress_detected';
  } else if (filename.includes('shoe') || filename.includes('sneaker') || filename.includes('boot')) {
    type = 'shoes';
    category = 'shoes';
    detectionMethod = 'shoes_detected';
  } else if (filename.includes('pant') || filename.includes('trouser') || filename.includes('chino')) {
    type = 'pants';
    category = 'bottoms';
    detectionMethod = 'pants_detected';
  } else if (filename.includes('short')) {
    type = 'shorts';
    category = 'bottoms';
    detectionMethod = 'shorts_detected';
  } else if (filename.includes('jacket') || filename.includes('coat')) {
    type = 'jacket';
    category = 'outerwear';
    detectionMethod = 'jacket_detected';
  } else if (filename.includes('sweater') || filename.includes('hoodie')) {
    type = 'sweater';
    category = 'outerwear';
    detectionMethod = 'sweater_detected';
  } else if (filename.includes('skirt')) {
    type = 'skirt';
    category = 'bottoms';
    detectionMethod = 'skirt_detected';
  } else if (filename.includes('tshirt') || filename.includes('t-shirt')) {
    type = 't-shirt';
    category = 'tops';
    detectionMethod = 'tshirt_detected';
  }
  
  // Color detection
  const originalColor = color;
  if (filename.includes('black')) color = 'black';
  else if (filename.includes('white')) color = 'white';
  else if (filename.includes('red')) color = 'red';
  else if (filename.includes('green')) color = 'green';
  else if (filename.includes('yellow')) color = 'yellow';
  else if (filename.includes('brown')) color = 'brown';
  else if (filename.includes('grey') || filename.includes('gray')) color = 'gray';
  else if (filename.includes('pink')) color = 'pink';
  else if (filename.includes('purple')) color = 'purple';
  else if (filename.includes('orange')) color = 'orange';
  
  console.log(`   ✅ Type: ${type} (${detectionMethod})`);
  console.log(`   ✅ Category: ${category}`);
  console.log(`   ✅ Color: ${color} ${color !== originalColor ? '(detected)' : '(default)'}`);
  
  return { type, category, color, detectionMethod };
}

console.log('\n' + '='.repeat(60));
console.log('TESTING VARIOUS FILENAMES:');
console.log('='.repeat(60));

testFilenames.forEach(filename => {
  detectFromFilename(filename);
});

console.log('\n' + '='.repeat(60));
console.log('✅ DETECTION LOGIC TEST COMPLETE');
console.log('='.repeat(60));

console.log('\n📝 OBSERVATIONS:');
console.log('1. Files with "jean" in name → Detected as jeans/bottoms ✅');
console.log('2. Files with color names → Color detected ✅');
console.log('3. Generic names (IMG_1234.jpg) → Default to shirt/blue ⚠️');
console.log('\n💡 SOLUTION: Users MUST name files descriptively!');
console.log('   Example: "blue-jeans.jpg" NOT "IMG_1234.jpg"');
