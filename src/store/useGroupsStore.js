import { create } from "zustand";
import { GroupService } from "../api/services/groupService";

export const useGroupsStore = create((set) => ({
  groups: [],
  loading: false,

  fetchGroups: async () => {
    set({ loading: true });
    try {
      const groups = await GroupService.list();
      set({ groups });
    } finally {
      set({ loading: false });
    }
  },

  createGroup: async (name) => {
    await GroupService.create(name);
    const groups = await GroupService.list();
    set({ groups });
  },

  joinGroup: async (inviteCode) => {
    await GroupService.join(inviteCode);
    const groups = await GroupService.list();
    set({ groups });
  },

  updateGroup: async (groupId, data) => {
    const updated = await GroupService.update(groupId, data);
    const groups = await GroupService.list();
    set({ groups });
    return updated;
  },
}));
