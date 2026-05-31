const fs = require('fs');
let code = fs.readFileSync('src/i18n.js', 'utf8');

code = code.replace(/'landing.find_best_services': 'Find the Best Services in Your',/g, '\'landing.find_perfect_service\': \'Find the perfect service\',');
code = code.replace(/'landing.neighborhood': 'Neighborhood',/g, '\'landing.near_you_instantly\': \'near you, instantly.\',');

code = code.replace(/'landing.find_best_services': 'अपने इलाके में सर्वश्रेष्ठ सेवाएं खोजें',/g, '\'landing.find_perfect_service\': \'एकदम सही सेवा खोजें\',');
code = code.replace(/'landing.neighborhood': 'आस-पड़ोस',/g, '\'landing.near_you_instantly\': \'आपके पास, तुरंत।\',');

code = code.replace(/'landing.find_best_services': 'तुमच्या परिसरातील सर्वोत्तम सेवा शोधा',/g, '\'landing.find_perfect_service\': \'तुमच्या जवळ परिपूर्ण सेवा शोधा\',');
code = code.replace(/'landing.neighborhood': 'शेजार',/g, '\'landing.near_you_instantly\': \'तुमच्या जवळ, त्वरित.\',');

fs.writeFileSync('src/i18n.js', code);
