import { render, screen } from '@testing-library/react';
import { StudyRecord } from './StudyRecord';

// Supabaseのモックを作成
jest.mock('./lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockResolvedValue({ data: [], error: null }),
      insert: jest.fn().mockResolvedValue({ error: null }),
      delete: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: null })
      })
    }))
  }
}));

describe('StudyRecord', () => {

  // 1. タイトルが表示されていること
  test('タイトルが表示されていること', async () => {
    render(<StudyRecord />);

    // ローディングが完了してタイトルが表示されるまで待機
    const titleElement = await screen.findByText(/学習記録一覧/i);
    expect(titleElement).toBeInTheDocument();
  });

  // 2. 入力をしないで登録を押すとエラーが表示される
  test('入力をしないで登録を押すとエラーが表示される', async () => {
    render(<StudyRecord />);

    // ローディング完了まで待機
    await screen.findByText(/学習記録一覧/i);

    // 初期状態でバリデーションメッセージが表示されることを確認
    const validationMessage = screen.getByText(/入力されていない項目があります/i);
    expect(validationMessage).toBeInTheDocument();

    // 登録ボタンが無効になっていることを確認
    const submitButton = screen.getByText('登録');
    expect(submitButton).toBeDisabled();
  });

  // 3. フォーム要素が表示されること
  test('フォーム要素が表示されること', async () => {
    render(<StudyRecord />);

    // ローディング完了まで待機
    await screen.findByText(/学習記録一覧/i);

    const titleLabel = screen.getByText('学習内容');
    const timeLabel = screen.getByText('学習時間');
    const submitButton = screen.getByText('登録');

    expect(titleLabel).toBeInTheDocument();
    expect(timeLabel).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });
});









