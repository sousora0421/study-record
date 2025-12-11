import { useState, useEffect } from 'react';
import './App.css';
import { supabase } from './lib/supabase';

export const StudyRecord = () => {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [records, setRecords] = useState([]);
  const [sumTime, setSumTime] = useState(0);
  const [loading, setLoading] = useState(true);

  const onChangeTitle = (event) => setTitle(event.target.value);
  const onChangeTime = (event) => setTime(event.target.value);

  // データベースから学習記録を取得
  const fetchRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('StudyTable')
        .select('*');

      if (error) {
        console.error('データ取得エラー:', error);
        return;
      }

      setRecords(data || []);
      // 合計時間を計算
      const total = data?.reduce((sum, record) => sum + (record.time || 0), 0) || 0;
      setSumTime(total);
    } catch (error) {
      console.error('予期しないエラー:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // データベースに新しい記録を追加
  const onClickAdd = async () => {
    try {
      const { error } = await supabase
        .from('StudyTable')
        .insert([
          {
            title: title,
            time: Number(time)
          }
        ]);

      if (error) {
        console.error('データ追加エラー:', error);
        return;
      }

      // 追加成功後、データを再取得
      await fetchRecords();
      setTitle("");
      setTime("");
    } catch (error) {
      console.error('予期しないエラー:', error);
    }
  };

  const onClickDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('StudyTable')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('データ削除エラー:', error);
        return;
      }

      await fetchRecords();
    } catch (error) {
      console.error('予期しないエラー:', error);
    }
  };

  const valid = () => title.length === 0 || time.length === 0

  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
    <>
      <h1>学習記録一覧</h1>
      <div>
        <label>学習内容</label>
        <input value={title} onChange={onChangeTitle} />
      </div>
      <div>
        <label>学習時間</label>
        <input value={time} onChange={onChangeTime} />
        <span>時間</span>
      </div>
      <div>入力されている学習内容：{title}</div>
      <div>入力されている時間:{time}時間</div>
      <button onClick={onClickAdd} disabled={valid()}>登録</button>
      { valid() && (
        <div style={{ color: "red" }}>
          入力されていない項目があります
        </div>
      )}
      <div>合計時間：{sumTime}/1000（h）</div>

      <h2>学習記録</h2>
      {records.length === 0 ? (
        <p>学習記録がありません</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {records.map((record, index) => (
            <li key={record.id || `record-${index}`} style={{
              border: '1px solid #ccc',
              margin: '10px 0',
              padding: '10px',
              borderRadius: '5px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div><strong>学習内容:</strong> {record.title}</div>
                <div><strong>学習時間:</strong> {record.time}時間</div>
              </div>
              <button onClick={() => onClickDelete(record.id)} style={{
                backgroundColor: '#ff4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '5px 10px',
                cursor: 'pointer'
              }}>削除</button>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
