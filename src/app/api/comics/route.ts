import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ComicProject } from '@/types/comic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const res = await query('SELECT * FROM comics WHERE id = $1', [id]);
      if (res.rows.length === 0) {
        return NextResponse.json({ error: '만화를 찾을 수 없습니다.' }, { status: 404 });
      }
      const row = res.rows[0];
      const comic: ComicProject = {
        id: row.id,
        title: row.title,
        subtitle: row.subtitle || '',
        topic: row.topic,
        audience: row.audience,
        author: row.author || '현스웹툰',
        sourceNote: row.source_note || '',
        headerDialogue: row.header_dialogue || {
          leftCharacter: { dialogue: '궁금한 점이 있어요!' },
          rightCharacter: { dialogue: '함께 살펴볼까요?' }
        },
        panels: row.panels,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
      return NextResponse.json(comic);
    }

    // 전체 목록 조회 (간략 정보)
    const listRes = await query(
      'SELECT id, title, subtitle, topic, audience, author, updated_at FROM comics ORDER BY updated_at DESC LIMIT 50'
    );
    return NextResponse.json(listRes.rows);
  } catch (err: any) {
    console.error('Error fetching comics:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const comic: ComicProject = await request.json();

    if (!comic.id || !comic.title || !comic.panels) {
      return NextResponse.json({ error: '필수 데이터가 누락되었습니다.' }, { status: 400 });
    }

    const checkRes = await query('SELECT id FROM comics WHERE id = $1', [comic.id]);

    if (checkRes.rows.length > 0) {
      // Update
      await query(
        `UPDATE comics 
         SET title = $1, subtitle = $2, topic = $3, audience = $4, author = $5, source_note = $6, 
             header_dialogue = $7, panels = $8, updated_at = CURRENT_TIMESTAMP
         WHERE id = $9`,
        [
          comic.title,
          comic.subtitle || '',
          comic.topic,
          comic.audience,
          comic.author || '현스웹툰',
          comic.sourceNote || '',
          JSON.stringify(comic.headerDialogue),
          JSON.stringify(comic.panels),
          comic.id,
        ]
      );
    } else {
      // Insert
      await query(
        `INSERT INTO comics (id, title, subtitle, topic, audience, author, source_note, header_dialogue, panels)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          comic.id,
          comic.title,
          comic.subtitle || '',
          comic.topic,
          comic.audience,
          comic.author || '현스웹툰',
          comic.sourceNote || '',
          JSON.stringify(comic.headerDialogue),
          JSON.stringify(comic.panels),
        ]
      );
    }

    return NextResponse.json({ success: true, id: comic.id });
  } catch (err: any) {
    console.error('Error saving comic:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'id 파라미터가 필요합니다.' }, { status: 400 });
    }
    await query('DELETE FROM comics WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
