import { useEffect, useState } from "react";
import { useDashboard } from "./store";
import { coursesApi, facultyApi, messagesApi, scheduleApi, studentsApi } from "@/lib/mock-api";

export function useCoursesData() {
  const courses = useDashboard((s) => s.courses);
  const loaded = useDashboard((s) => s.coursesLoaded);
  const setCourses = useDashboard((s) => s.setCourses);
  useEffect(() => {
    if (loaded) return;
    let alive = true;
    coursesApi.list().then((c) => alive && setCourses(c));
    return () => { alive = false; };
  }, [loaded, setCourses]);
  return { courses, loaded };
}

export function useStudentsData() {
  const students = useDashboard((s) => s.students);
  const loaded = useDashboard((s) => s.studentsLoaded);
  const setStudents = useDashboard((s) => s.setStudents);
  useEffect(() => {
    if (loaded) return;
    let alive = true;
    studentsApi.list().then((s) => alive && setStudents(s));
    return () => { alive = false; };
  }, [loaded, setStudents]);
  return { students, loaded };
}

export function useFacultyData() {
  const faculty = useDashboard((s) => s.faculty);
  const loaded = useDashboard((s) => s.facultyLoaded);
  const setFaculty = useDashboard((s) => s.setFaculty);
  useEffect(() => {
    if (loaded) return;
    let alive = true;
    facultyApi.list().then((f) => alive && setFaculty(f));
    return () => { alive = false; };
  }, [loaded, setFaculty]);
  return { faculty, loaded };
}

export function useScheduleData() {
  const schedule = useDashboard((s) => s.schedule);
  const loaded = useDashboard((s) => s.scheduleLoaded);
  const setSchedule = useDashboard((s) => s.setSchedule);
  useEffect(() => {
    if (loaded) return;
    let alive = true;
    scheduleApi.list().then((e) => alive && setSchedule(e));
    return () => { alive = false; };
  }, [loaded, setSchedule]);
  return { schedule, loaded };
}

export function useThreadsData() {
  const threads = useDashboard((s) => s.threads);
  const loaded = useDashboard((s) => s.threadsLoaded);
  const setThreads = useDashboard((s) => s.setThreads);
  useEffect(() => {
    if (loaded) return;
    let alive = true;
    messagesApi.list().then((t) => alive && setThreads(t));
    return () => { alive = false; };
  }, [loaded, setThreads]);
  return { threads, loaded };
}

export function useDebounced<T>(value: T, ms = 250): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return v;
}