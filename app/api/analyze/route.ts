import { NextResponse } from 'next/server';
import { analyzeExamDocuments } from '@/lib/minimax';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      questionPaperImages = [],
      answerSheetImages = [],
      questionPaperName = 'Question_Paper.pdf',
      answerSheetName = 'Answer_Sheet.pdf',
    } = body;

    const result = await analyzeExamDocuments(
      questionPaperImages,
      answerSheetImages,
      questionPaperName,
      answerSheetName
    );

    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
