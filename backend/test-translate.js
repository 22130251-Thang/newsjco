const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const testTranslate = async () => {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.log('❌ GEMINI_API_KEY not found in .env');
        return;
    }

    console.log('✅ API Key found');

    const genAI = new GoogleGenAI({ apiKey });

    // Sample Vietnamese article content (typical news article length)
    const sampleArticle = `
    Thủ tướng Phạm Minh Chính chủ trì Hội nghị công bố quy hoạch và xúc tiến đầu tư tỉnh Bình Thuận.
    
    Sáng 3/1, tại Phan Thiết, Thủ tướng Phạm Minh Chính dự và chủ trì Hội nghị công bố quy hoạch và xúc tiến đầu tư tỉnh Bình Thuận đến năm 2030, tầm nhìn đến năm 2050.
    
    Phát biểu tại Hội nghị, Thủ tướng nhấn mạnh Bình Thuận có vị trí địa lý thuận lợi, nằm trong vùng kinh tế trọng điểm phía Nam, là cửa ngõ giao thương quan trọng.
    
    Tỉnh có tiềm năng lớn về du lịch biển, năng lượng tái tạo, đặc biệt là điện gió và điện mặt trời. Bình Thuận cũng là vựa thanh long lớn nhất cả nước với diện tích trồng khoảng 30.000 ha.
    
    Thủ tướng đề nghị tỉnh tập trung phát triển hạ tầng giao thông, đặc biệt là sân bay Phan Thiết, cao tốc Bắc - Nam, cảng biển Vĩnh Tân. Đồng thời đẩy mạnh chuyển đổi số, phát triển du lịch chất lượng cao.
  `;

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'zh', name: 'Chinese' },
        { code: 'ja', name: 'Japanese' },
    ];

    console.log('\n📊 Testing translation speed...\n');
    console.log(`📝 Article length: ${sampleArticle.length} characters\n`);

    for (const lang of languages) {
        console.log(`🌐 Translating to ${lang.name}...`);

        const startTime = Date.now();

        try {
            const prompt = `Translate the following Vietnamese article to ${lang.name}. Keep the formatting and structure. Only output the translation, no explanations:\n\n${sampleArticle}`;

            const result = await genAI.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            const endTime = Date.now();
            const duration = (endTime - startTime) / 1000;

            console.log(`   ✅ Success! Time: ${duration.toFixed(2)}s`);
            console.log(`   📄 Output length: ${result.text?.length || 0} characters`);
            console.log(`   📖 Preview: ${result.text?.substring(0, 100)}...\n`);

        } catch (error) {
            console.log(`   ❌ Error: ${error.message}\n`);
        }
    }

    console.log('✨ Test completed!');
};

testTranslate();
