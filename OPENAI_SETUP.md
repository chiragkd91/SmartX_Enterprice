# 🤖 OpenAI Integration Setup Guide

## Overview
Your Recruitment Management system now includes AI-powered job description generation using OpenAI's GPT-3.5-turbo model. This feature automatically generates professional job descriptions, requirements, and benefits based on the job title and department.

## 🚀 Quick Setup

### 1. Get OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in to your OpenAI account
3. Click "Create new secret key"
4. Copy the generated API key (starts with `sk-`)

### 2. Configure Environment Variable
1. Open the `.env.local` file in your project root
2. Replace `your_openai_api_key_here` with your actual API key:
   ```env
   OPENAI_API_KEY=sk-proj-your_actual_api_key_here
   ```

### 3. Start the Server
```bash
# Make sure the server is running
npm run server:dev
```

## ✨ How to Use

### In the Recruitment Management System:
1. Navigate to the **Recruitment Management** page
2. Click **"Post New Job"**
3. Fill in the required fields:
   - **Job Title** (required for AI generation)
   - **Department** (required for AI generation)
   - Other optional fields (experience, location, salary)
4. Click **"Auto Generate with AI"** button
5. Wait 2-3 seconds for AI generation
6. Review and edit the generated content
7. Create your job posting

## 🎯 Features

### Smart Content Generation:
- **Job Descriptions**: Compelling overviews with key responsibilities
- **Requirements**: Essential skills, qualifications, and experience
- **Benefits**: Attractive perks and compensation packages

### Context-Aware:
- **Department-specific** language and terminology
- **Role-appropriate** responsibilities and requirements
- **Experience-level** tailored content
- **Salary integration** in benefits section

### Professional Quality:
- **Human-like** writing style
- **Industry standards** compliance
- **Structured format** with bullet points
- **Customizable** output for editing

## 🔧 Technical Details

### API Endpoint
```
POST /api/generate-job-description
```

### Request Format
```json
{
  "title": "Senior React Developer",
  "department": "IT",
  "type": "Full-time",
  "experience": "3-5 years",
  "location": "Mumbai, Maharashtra",
  "salaryRange": "₹8-12 LPA"
}
```

### Response Format
```json
{
  "description": "Generated job description...",
  "requirements": "Generated requirements...",
  "benefits": "Generated benefits..."
}
```

## 💰 Pricing & Usage

### OpenAI Pricing (GPT-3.5-turbo):
- **Input**: ~$0.0015 per 1K tokens
- **Output**: ~$0.002 per 1K tokens
- **Per job description**: ~$0.01 - $0.02

### Estimated Monthly Costs:
- **10 job descriptions/month**: ~$0.20
- **50 job descriptions/month**: ~$1.00
- **100 job descriptions/month**: ~$2.00

## 🔒 Security & Best Practices

### API Key Security:
- ✅ Store in environment variables only
- ✅ Never commit API keys to version control
- ✅ Use different keys for development/production
- ✅ Rotate keys regularly

### Error Handling:
- Invalid API key detection
- Rate limit handling
- Network error recovery
- Graceful fallbacks

## 🐛 Troubleshooting

### Common Issues:

#### "Invalid OpenAI API key" Error
- **Solution**: Check your API key in `.env.local`
- **Verify**: Key starts with `sk-` and is complete

#### "API quota exceeded" Error
- **Solution**: Check your OpenAI billing and usage limits
- **Action**: Upgrade your OpenAI plan if needed

#### "Network Error" / Timeout
- **Solution**: Check internet connection
- **Retry**: The system handles retries automatically

#### Generation Takes Too Long
- **Normal**: 2-3 seconds is expected
- **Check**: Network speed and OpenAI status

### Debug Steps:
1. Check server console for error logs
2. Verify API key format and validity
3. Test with a simple job title like "Software Developer"
4. Check OpenAI dashboard for usage and errors

## 🔄 Fallback Options

If OpenAI is unavailable, you can:
1. **Manual Entry**: Fill in job details manually
2. **Template System**: Use the built-in template fallback
3. **Copy from Existing**: Duplicate similar job postings

## 📈 Future Enhancements

### Planned Features:
- **Custom prompts** for different industries
- **Multi-language** support
- **Bulk generation** for multiple jobs
- **A/B testing** for different content styles
- **Integration** with other AI models

## 🆘 Support

### Need Help?
- Check the [OpenAI Documentation](https://platform.openai.com/docs)
- Review error messages in browser console
- Check server logs for detailed error information
- Ensure your OpenAI account has sufficient credits

### Contact:
- Create an issue in the project repository
- Include error messages and steps to reproduce
- Provide browser and system information

---

🎉 **Congratulations!** You now have AI-powered job description generation in your recruitment system. This will save significant time and ensure professional, consistent job postings.
