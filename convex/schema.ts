import { defineSchema, s } from 'convex-dev';

export default defineSchema({
  users: {
    fields: {
      userId: s.string(),
      classroomCode: s.string(),
      role: s.string(),
    },
  },
  tasks: {
    fields: {
      classroomCode: s.string(),
      taskContent: s.string(),
      createdAt: s.number(),
    },
  },
});
