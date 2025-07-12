import OpenAI from 'openai';
import db from '../database/init.js';

let openai = null;

export const initAIService = async () => {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (apiKey) {
    openai = new OpenAI({
      apiKey: apiKey
    });
    console.log('✅ OpenAI service initialized');
  } else {
    console.log('⚠️ OpenAI API key not found, using mock responses');
  }
};

export const generateAIResponse = async (message, user, schoolId) => {
  try {
    if (!openai) {
      // Mock responses for development
      return generateMockResponse(message, user, schoolId);
    }

    const systemPrompt = generateSystemPrompt(user, schoolId);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('AI response generation error:', error);
    return generateMockResponse(message, user, schoolId);
  }
};

const generateSystemPrompt = (user, schoolId) => {
  const role = user.role;
  const school = getSchoolContext(schoolId);
  
  return `You are School Nexus AI Assistant, a helpful AI assistant for ${school.name}. 

User Role: ${role}
School: ${school.name}

You can help with:
- Student information and records
- Attendance tracking
- Assignment management
- Grade inquiries
- Schedule information
- Report generation
- General school operations

Please provide helpful, accurate responses based on the user's role and school context. 
Keep responses concise and professional. If you need to generate reports or documents, mention that you can help with that.

School Context:
- School Name: ${school.name}
- Address: ${school.address}
- Phone: ${school.phone}
- Email: ${school.email}
- Website: ${school.website}
- Subscription Plan: ${school.subscriptionPlan}

Remember to respect user privacy and only provide information appropriate for their role.`;
};

const getSchoolContext = (schoolId) => {
  // In a real app, this would fetch from database
  const schools = {
    'school-1': {
      name: 'Riverside High School',
      address: '123 Riverside Drive, City, State 12345',
      phone: '+1-555-0123',
      email: 'admin@riverside.edu',
      website: 'https://riverside.edu',
      subscriptionPlan: 'premium'
    },
    'school-2': {
      name: 'Sunset Elementary',
      address: '456 Sunset Blvd, City, State 12345',
      phone: '+1-555-0456',
      email: 'admin@sunset.edu',
      website: 'https://sunset.edu',
      subscriptionPlan: 'basic'
    }
  };
  
  return schools[schoolId] || schools['school-1'];
};

const generateMockResponse = (message, user, schoolId) => {
  const role = user.role;
  const lowerMessage = message.toLowerCase();
  
  const responses = {
    'super-admin': {
      'attendance': 'As a super admin, I can see attendance data across all schools. The overall attendance rate is 94.2%. Would you like me to generate a detailed report?',
      'report': 'I can help you generate comprehensive reports across all schools. What specific metrics would you like to include?',
      'schools': 'I can see all schools in the system. Currently there are 45 active schools with 12,890 total users.',
      'revenue': 'The total monthly revenue across all schools is $89,450. Would you like a detailed breakdown?',
      'default': 'As a super admin, I can help you manage all schools, view system-wide metrics, and generate comprehensive reports. What would you like to know?'
    },
    'school-admin': {
      'attendance': 'Current school attendance rate is 94.2%. Here\'s the breakdown by grade level. Would you like me to generate a detailed attendance report?',
      'report': 'I\'ve generated your monthly report. It shows improved performance across all departments. The report is ready for download.',
      'students': 'You currently have 1,247 active students. 45 new enrollments this month. Would you like to see the enrollment trends?',
      'teachers': 'You have 89 active teachers. 5 new teachers joined this month. Would you like to see teacher performance metrics?',
      'revenue': 'Your school\'s monthly revenue is $12,450. This represents an 8.3% increase from last month.',
      'default': 'I can help you manage school operations, generate reports, track student performance, and more. What would you like to know?'
    },
    'teacher': {
      'grade': 'Your students\' average grade is 85.4%. Here are the detailed analytics by subject. Would you like me to generate a grade report?',
      'assignment': 'You have 12 pending assignments to review. Would you like me to prioritize them by due date?',
      'attendance': 'Class attendance for your subjects averages 96.8%. Here\'s the detailed breakdown by class.',
      'students': 'You teach 180 students across 6 classes. Would you like to see individual student performance?',
      'default': 'I can help you with grading, attendance tracking, lesson planning, and student progress. How can I assist?'
    },
    'student': {
      'assignment': 'You have 5 pending assignments. The next due date is Friday for Physics homework. Would you like me to show you the details?',
      'grade': 'Your current GPA is 3.7. Here\'s your subject-wise performance breakdown. Would you like to see improvement suggestions?',
      'schedule': 'Tomorrow you have Math at 9 AM, Physics at 11 AM, and Chemistry at 2 PM. Would you like me to set a reminder?',
      'attendance': 'Your attendance rate is 96.5%. You\'ve missed 3 classes this semester. Would you like to see the details?',
      'default': 'I can help you track assignments, check grades, view your schedule, and provide study tips. What do you need?'
    },
    'parent': {
      'child': 'I can help you track your child\'s progress. Would you like to see their recent grades and attendance?',
      'schedule': 'I can show you your child\'s class schedule and upcoming events. Would you like me to send you a calendar invite?',
      'communication': 'I can help you communicate with teachers and schedule parent-teacher meetings. What would you like to discuss?',
      'default': 'I can help you stay informed about your child\'s education, communicate with teachers, and track their progress. How can I assist?'
    }
  };

  const roleResponses = responses[role] || responses.student;
  
  for (const [key, response] of Object.entries(roleResponses)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }
  
  return roleResponses.default;
};

export const generateDocument = async (type, data, user, schoolId) => {
  try {
    const school = getSchoolContext(schoolId);
    
    const documentTemplates = {
      'id-card': generateIDCardTemplate(data, school),
      'report-card': generateReportCardTemplate(data, school),
      'certificate': generateCertificateTemplate(data, school),
      'admission-letter': generateAdmissionLetterTemplate(data, school)
    };

    const template = documentTemplates[type];
    if (!template) {
      throw new Error(`Unknown document type: ${type}`);
    }

    // In a real app, this would use a PDF generation library
    return {
      content: template,
      type: 'pdf',
      filename: `${type}-${Date.now()}.pdf`
    };
  } catch (error) {
    console.error('Document generation error:', error);
    throw error;
  }
};

const generateIDCardTemplate = (data, school) => {
  return `
    <div style="width: 400px; height: 250px; border: 2px solid #000; padding: 20px; font-family: Arial, sans-serif;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="margin: 0; color: #2563eb;">${school.name}</h2>
        <p style="margin: 5px 0; color: #6b7280;">Student ID Card</p>
      </div>
      <div style="display: flex; gap: 20px;">
        <div style="flex: 1;">
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Student ID:</strong> ${data.studentId}</p>
          <p><strong>Grade:</strong> ${data.grade}</p>
          <p><strong>Section:</strong> ${data.section}</p>
          <p><strong>Academic Year:</strong> 2024-2025</p>
        </div>
        <div style="width: 100px; height: 120px; background: #f3f4f6; border: 1px solid #d1d5db; display: flex; align-items: center; justify-content: center;">
          <span style="color: #9ca3af;">Photo</span>
        </div>
      </div>
      <div style="margin-top: 20px; text-align: center; font-size: 12px; color: #6b7280;">
        <p>This card is valid for the academic year 2024-2025</p>
        <p>${school.address} | ${school.phone}</p>
      </div>
    </div>
  `;
};

const generateReportCardTemplate = (data, school) => {
  return `
    <div style="width: 600px; padding: 20px; font-family: Arial, sans-serif;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="margin: 0; color: #2563eb;">${school.name}</h1>
        <h2 style="margin: 10px 0; color: #374151;">Report Card</h2>
        <p style="margin: 5px 0; color: #6b7280;">Academic Year: 2024-2025 | Term: ${data.term || 'First Semester'}</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <p><strong>Student Name:</strong> ${data.name}</p>
        <p><strong>Student ID:</strong> ${data.studentId}</p>
        <p><strong>Grade:</strong> ${data.grade}</p>
        <p><strong>Section:</strong> ${data.section}</p>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background: #f3f4f6;">
            <th style="border: 1px solid #d1d5db; padding: 10px; text-align: left;">Subject</th>
            <th style="border: 1px solid #d1d5db; padding: 10px; text-align: center;">Grade</th>
            <th style="border: 1px solid #d1d5db; padding: 10px; text-align: center;">Percentage</th>
            <th style="border: 1px solid #d1d5db; padding: 10px; text-align: center;">Remarks</th>
          </tr>
        </thead>
        <tbody>
          ${data.subjects?.map(subject => `
            <tr>
              <td style="border: 1px solid #d1d5db; padding: 10px;">${subject.name}</td>
              <td style="border: 1px solid #d1d5db; padding: 10px; text-align: center;">${subject.grade}</td>
              <td style="border: 1px solid #d1d5db; padding: 10px; text-align: center;">${subject.percentage}%</td>
              <td style="border: 1px solid #d1d5db; padding: 10px; text-align: center;">${subject.remarks}</td>
            </tr>
          `).join('') || ''}
        </tbody>
      </table>
      
      <div style="margin-top: 20px;">
        <p><strong>Overall GPA:</strong> ${data.gpa || '3.7'}</p>
        <p><strong>Attendance:</strong> ${data.attendance || '96.5%'}</p>
        <p><strong>Class Rank:</strong> ${data.rank || '15/180'}</p>
      </div>
      
      <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #6b7280;">
        <p>${school.address} | ${school.phone} | ${school.email}</p>
      </div>
    </div>
  `;
};

const generateCertificateTemplate = (data, school) => {
  return `
    <div style="width: 800px; height: 600px; border: 3px solid #2563eb; padding: 40px; font-family: 'Times New Roman', serif; text-align: center; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);">
      <div style="margin-bottom: 40px;">
        <h1 style="margin: 0; color: #1e40af; font-size: 36px;">${school.name}</h1>
        <p style="margin: 10px 0; color: #6b7280; font-size: 18px;">Certificate of Achievement</p>
      </div>
      
      <div style="margin: 60px 0;">
        <p style="font-size: 20px; color: #374151; margin-bottom: 20px;">This is to certify that</p>
        <h2 style="margin: 20px 0; color: #1e40af; font-size: 32px; text-decoration: underline;">${data.name}</h2>
        <p style="font-size: 18px; color: #374151; margin: 20px 0;">has successfully completed</p>
        <h3 style="margin: 20px 0; color: #1e40af; font-size: 24px;">${data.achievement || 'Outstanding Academic Performance'}</h3>
        <p style="font-size: 16px; color: #6b7280; margin: 20px 0;">during the academic year 2024-2025</p>
      </div>
      
      <div style="margin-top: 60px; display: flex; justify-content: space-between; align-items: flex-end;">
        <div style="text-align: center;">
          <div style="width: 150px; height: 2px; background: #1e40af; margin: 0 auto 10px;"></div>
          <p style="margin: 0; font-size: 14px; color: #374151;">Principal</p>
        </div>
        <div style="text-align: center;">
          <div style="width: 150px; height: 2px; background: #1e40af; margin: 0 auto 10px;"></div>
          <p style="margin: 0; font-size: 14px; color: #374151;">Date</p>
        </div>
      </div>
      
      <div style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); font-size: 12px; color: #6b7280;">
        <p>Certificate ID: ${data.certificateId || 'CERT-2024-001'}</p>
      </div>
    </div>
  `;
};

const generateAdmissionLetterTemplate = (data, school) => {
  return `
    <div style="width: 600px; padding: 20px; font-family: Arial, sans-serif;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="margin: 0; color: #2563eb;">${school.name}</h1>
        <p style="margin: 5px 0; color: #6b7280;">${school.address}</p>
        <p style="margin: 5px 0; color: #6b7280;">${school.phone} | ${school.email}</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>To:</strong> ${data.parentName || 'Parent/Guardian'}</p>
        <p><strong>Subject:</strong> Admission Confirmation - ${data.studentName || 'Student Name'}</p>
      </div>
      
      <div style="margin-bottom: 30px; line-height: 1.6;">
        <p>Dear ${data.parentName || 'Parent/Guardian'},</p>
        
        <p>We are pleased to inform you that ${data.studentName || 'your child'} has been successfully admitted to ${school.name} for the academic year 2024-2025.</p>
        
        <p><strong>Admission Details:</strong></p>
        <ul>
          <li><strong>Student Name:</strong> ${data.studentName || 'Student Name'}</li>
          <li><strong>Student ID:</strong> ${data.studentId || 'STU-2024-001'}</li>
          <li><strong>Grade:</strong> ${data.grade || '10'}</li>
          <li><strong>Section:</strong> ${data.section || 'A'}</li>
          <li><strong>Admission Date:</strong> ${data.admissionDate || new Date().toLocaleDateString()}</li>
        </ul>
        
        <p><strong>Important Information:</strong></p>
        <ul>
          <li>Classes will begin on ${data.classStartDate || 'August 15, 2024'}</li>
          <li>Please complete all required documentation by ${data.documentDeadline || 'August 10, 2024'}</li>
          <li>School uniform and books can be purchased from the school store</li>
          <li>Orientation program will be held on ${data.orientationDate || 'August 12, 2024'}</li>
        </ul>
        
        <p>We look forward to welcoming ${data.studentName || 'your child'} to our school community.</p>
        
        <p>Best regards,<br>
        <strong>Admissions Office</strong><br>
        ${school.name}</p>
      </div>
      
      <div style="margin-top: 30px; padding: 15px; background: #f3f4f6; border-left: 4px solid #2563eb;">
        <p style="margin: 0; font-size: 14px; color: #374151;">
          <strong>Note:</strong> This is an official admission letter. Please keep it safe for future reference.
        </p>
      </div>
    </div>
  `;
};