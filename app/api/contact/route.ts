import { NextRequest, NextResponse } from 'next/server';
import { createLead } from '@/lib/db';
// TODO: Import Resend for email notifications
// import { Resend } from 'resend';
// const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, industry, problemDescription } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Save lead to database
    const lead = await createLead({
      name,
      email,
      company: company || null,
      industry: industry || null,
      problem_description: problemDescription || null,
    });

    // TODO: Send email notification using Resend
    // await resend.emails.send({
    //   from: 'WaveSprint <notifications@wavesprint.ai>',
    //   to: process.env.ADMIN_EMAIL || 'admin@wavesprint.ai',
    //   subject: `New Lead: ${name}`,
    //   html: `
    //     <h2>New Lead Submission</h2>
    //     <p><strong>Name:</strong> ${name}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     <p><strong>Company:</strong> ${company || 'N/A'}</p>
    //     <p><strong>Industry:</strong> ${industry || 'N/A'}</p>
    //     <p><strong>Problem:</strong> ${problemDescription || 'N/A'}</p>
    //   `,
    // });

    return NextResponse.json({
      success: true,
      leadId: lead.id,
    });
  } catch (error) {
    console.error('Error in contact API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

