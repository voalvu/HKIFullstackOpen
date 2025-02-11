import { useEffect, useState, JSX } from 'react';
import { AxiosResponse, AxiosError } from 'axios';
import { z } from 'zod';
import { newDiarySchema } from './utils';
import firstServices from './services/firstServices';
import { Visibility, Weather } from '../../flight-diary/src/types';

function App() {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [newDiary, setNewDiary] = useState<NewDiary>({
    date: '',
    weather: '' as Weather,
    visibility: '' as Visibility,
    comment: ''
  });
  const [notification, setNotification] = useState<[string, string]>(['','green']);

  type NewDiary = z.infer<typeof newDiarySchema>;

  interface Diary {
    id: string;
    date: string;
    weather: string;
    visibility: string;
    comment: string;
  }

  const diaryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault();
    console.log(newDiary);
    const diaryToAdd = {
      ...newDiary,
      id: String(diaries.length + 1)
    };
    firstServices.create(diaryToAdd).then((res: string | AxiosResponse | AxiosError) => {
          if(typeof res === 'string'){
            setNotification([res,'red'])
            return;
          }    
          if (res instanceof AxiosError) {
            setNotification([res.response?.data as string, 'red']);
            return;
          }
          console.log(res);
          setNotification([`Added entry: ${JSON.stringify(res.data)}`,'green']);
          setDiaries(diaries.concat(diaryToAdd));
          setNewDiary({
            date: '',
            weather: '' as Weather,
            visibility: '' as Visibility,
            comment: ''
          });
        })
    setTimeout(() => setNotification(['', 'green']), 5000);
  };

  useEffect(() => {
      firstServices.getAll().then((res: AxiosResponse) => {
        setDiaries(res.data);
      });
    
  }, []);

  const Warning = ({ el, kind }: { el: string; kind: string }): JSX.Element | null => {
    //console.log(typeof el, typeof kind);
    switch (kind) {
      case 'weather':
        try {
          if (el.length === 0) return null;
          z.nativeEnum(Weather).parse(el);
          return null;
        } catch{
          return <p style={{ color: 'red' }}>Invalid weather format</p>;
        }
      case 'date':
        try {
          if (el.length === 0) return null;
          z.string().date().parse(el);
          return null;
        } catch {
          return <p style={{ color: 'red' }}>Invalid date format</p>;
        }
      case 'visibility':
        try {
          if (el.length === 0) return null;
          z.nativeEnum(Visibility).parse(el);
          return null;
        } catch  {
          return <p style={{ color: 'red' }}>Invalid visibility format</p>;
        }
      case 'comment':
        try {
          if (el.length === 0) return null;
          z.string().parse(el);
          return null;
        } catch {
          return <p style={{ color: 'red' }}>Invalid comment format</p>;
        }
      default:
        return <></>;
    }
  };

  return (
    <div>
      <h1>Flight weather diary:</h1>
      <p style={{color:notification[1]}}>{notification[0]}</p>
      <h2>add new entry:</h2>
      <form onSubmit={diaryCreation} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <label>date</label>
          <input value={newDiary.date} onChange={(event) => setNewDiary({ ...newDiary, date: event.target.value })} />
          <Warning el={newDiary.date} kind={'date'}></Warning>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <label>weather</label>
          <input value={newDiary.weather} onChange={(event) => setNewDiary({ ...newDiary, weather: event.target.value as Weather })} />
          <Warning el={newDiary.weather} kind={'weather'}></Warning>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <label>visibility</label>
          <input value={newDiary.visibility} onChange={(event) => setNewDiary({ ...newDiary, visibility: event.target.value as Visibility })} />
          <Warning el={newDiary.visibility} kind={'visibility'}></Warning>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <label>comment</label>
          <input value={newDiary.comment} onChange={(event) => setNewDiary({ ...newDiary, comment: event.target.value })} />
          <Warning el={newDiary.comment} kind={'comment'}></Warning>
        </div>
        <button type='submit'>add</button>
      </form>

      <h2>Diaries:</h2>
      <div>
        {diaries.map((diary, index) => (
          <div key={index}>
            {Object.entries(diary).map(([key, value]) => (
              <p key={key}>
                <strong>{key}:</strong> {value}
              </p>
            ))}
            <br></br>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
