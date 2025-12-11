import { useState } from 'react';
import './App.css';

export const StudyRecord = () => {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [records, setRecords] = useState([]);
  const [sumTime, setSumTime] = useState(0)

  const onChangeTitle = (event) => setTitle(event.target.value);
  const onChangeTime = (event) => setTime(event.target.value);

  const onClickAdd = () => {
    const newRecords = [...records, {title, time: Number(time)}];
    console.log("更新前:", records);
    console.log("更新後:", newRecords);
    setSumTime(sumTime + Number(time));
    setRecords(newRecords);
    setTitle("");
    setTime("");
  };

  const valid = () => title.length === 0 || time.length === 0

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
    </>
  )
}
