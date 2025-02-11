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
  const EnumRadio = ({ option, radioType }: { option: string, radioType: string }) => {
    return (
      <>
        <label>{option}</label>
        <input
          type='radio'
          value={option}
          checked={newDiary[radioType as keyof NewDiary] === option}
          onChange={(event) => setNewDiary({ ...newDiary, [radioType]: event.target.value })}
        />&emsp;
      </>
    );
  };

  const DiaryPart = ({ kind }: { kind: string }) => {
    switch (kind) {
      case "date":
        return <DateInput />;
      case "weather":
        return <WeatherInput />;
      case "visibility":
        return <VisibilityInput />;
      case "comment":
        return <CommentInput />;
      default:
        return null;
    }
  };

  const DateInput = () => (
    <div style={{ display: 'flex', alignItems: 'baseline' }}>
      <label>date&emsp;</label>
      <input
        value={newDiary.date}
        onChange={(event) => setNewDiary({ ...newDiary, date: event.target.value })}
        type="date"
      />
      <Warning el={newDiary.date} kind="date" />
    </div>
  );

  const WeatherInput = () => (
    <div style={{ display: 'flex', alignItems: 'baseline' }}>
      <label>weather&emsp;</label>
      {Object.values(Weather).map((w, index) => (
        <EnumRadio key={index} radioType="weather" option={w.toString()} />
      ))}
      <Warning el={newDiary.weather} kind="weather" />
    </div>
  );

  const VisibilityInput = () => (
    <div style={{ display: 'flex', alignItems: 'baseline' }}>
      <label>visibility&emsp;</label>
      {Object.values(Visibility).map((v, index) => (
        <EnumRadio key={index} radioType="visibility" option={v.toString()} />
      ))}
      <Warning el={newDiary.visibility} kind="visibility" />
    </div>
  );

  const CommentInput = () => (
    <div style={{ display: 'flex', alignItems: 'baseline' }}>
      <label>comment&emsp;</label>
      <input
        value={newDiary.comment}
        onChange={(event) => setNewDiary({ ...newDiary, comment: event.target.value })}
      />
      <Warning el={newDiary.comment} kind="comment" />
    </div>
  );

  return (
    <div>
      <h1>Flight weather diary:</h1>
      <p style={{color:notification[1]}}>{notification[0]}</p>
      <h2>add new entry:</h2>
      <form onSubmit={diaryCreation} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        {Object.keys(newDiary).map((key) => (
          <DiaryPart key={key} kind={key} />
        ))}
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
