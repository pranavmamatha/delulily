import { create } from "zustand"

type profile = {
    full_name: string|null
    avatar_url: string|null

    set_profile: (full_name: string, avatar_url: string) => void
    reset: ()=>void
}

export const useProfileStore = create<profile>((set)=>({
    full_name: null,
    avatar_url: null,
    set_profile: (full_name: string, avatar_url: string)=>{
        set(()=>({
            full_name,
            avatar_url
        }))
    },
    reset: ()=>{
        set(()=>({
            full_name: null,
            avatar_url: null
        }))
    }
}))