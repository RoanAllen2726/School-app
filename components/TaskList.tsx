import { useQuery } from '@convex/react';

const TaskList = ({ classroomCode }: { classroomCode: string }) => {
  const tasks = useQuery('getTasks', { classroomCode });

  return (
    <ul>
      {tasks?.map((task) => (
        <li key={task._id}>{task.taskContent}</li>
      ))}
    </ul>
  );
};

export default TaskList;
