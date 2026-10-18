import { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import ProgressBar from './ui/ProgressBar';

// Reusable interactive course player. Pass course metadata and lesson data to use it for any course.
// TODO(media): Replace the visual lesson stage with a real HTML video URL once media is stored remotely.
export default function CoursePlayer({ courseId, title, accent = '🐍', lessons, onBack }) {
  const { progress, saveProgress } = useLibrary();
  const [playing, setPlaying] = useState(false);
  const [lessonIndex, setLessonIndex] = useState(0);
  const progressValue = progress[courseId] || 18;
  const activeLesson = lessons[lessonIndex];

  function selectLesson(index) {
    setLessonIndex(index);
    setPlaying(true);
    saveProgress(courseId, Math.max(progressValue, Math.round(((index + 1) / lessons.length) * 100)));
  }
  function togglePlay() {
    setPlaying((value) => !value);
    saveProgress(courseId, Math.min(100, progressValue + 5));
  }

  return <section className="course-player-page">
    <header className="course-player-header"><button onClick={onBack}>← Back to courses</button><div><span>Video lesson</span><b>{activeLesson.title}</b></div><button className="signup" onClick={togglePlay}>{playing ? 'Pause' : 'Play'}</button></header>
    <div className="course-player-layout">
      <section className="course-video-panel">
        <div className="course-video-stage" aria-label={`${title}: ${activeLesson.title}`}>
          <div className="course-video-grid" aria-hidden="true" />
          <span className="course-video-accent">{accent}</span>
          <div className="course-video-copy"><p>PYTHON MASTERCLASS</p><h1>{title}</h1><span>{activeLesson.title}</span></div>
          <button className="course-play-button" onClick={togglePlay} aria-label={playing ? 'Pause course' : 'Play course'}>{playing ? 'Ⅱ' : '▶'}</button>
          <small>{playing ? 'Playing this lesson' : 'Ready to play'} · {activeLesson.duration}</small>
        </div>
        <div className="course-player-controls"><button onClick={togglePlay}>{playing ? 'Pause' : 'Play'}</button><div className="course-timeline" aria-label={`${progressValue}% course progress`}><i style={{ width: `${progressValue}%` }} /></div><span>{progressValue}% complete</span></div>
        <ProgressBar value={progressValue} label="Course progress" />
      </section>
      <aside className="course-lesson-list"><div><b>Course Content</b><small>{lessons.length} lessons · 2h 45m</small></div>{lessons.map((lesson, index) => <button key={lesson.title} className={index === lessonIndex ? 'active' : ''} onClick={() => selectLesson(index)}><span>{index + 1}. {lesson.title}</span><small>{lesson.duration}</small></button>)}</aside>
    </div>
  </section>;
}
