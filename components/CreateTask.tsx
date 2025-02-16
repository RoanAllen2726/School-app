import { useMutation } from '../convex/_generated/react'; // Adjust the path as needed
import { useForm } from 'react-hook-form';

// Define the shape of the form data
type TaskFormData = {
  taskContent: string;
};

const CreateTask = () => {
  // Use the generated type for the Convex mutation
  const mutation = useMutation('createTask');

  // Use the form data type in the useForm hook
  const { register, handleSubmit } = useForm<TaskFormData>();

  // Annotate the data parameter
  const onSubmit = async (data: TaskFormData) => {
    try {
      await mutation(data); // Ensure `mutation` matches the backend's input type
      alert('Task posted successfully!');
    } catch (error) {
      console.error('Failed to post task:', error);
      alert('Error posting task.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('taskContent')} placeholder="Task Content" />
      <button type="submit">Post Task</button>
    </form>
  );
};

export default CreateTask;
