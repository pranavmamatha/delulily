import { supabase } from '@/lib/supabase'
import React from 'react'
import { Button, View } from 'react-native'

async function onSignOutButtonPress() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Error signing out:', error)
  }
}

export default function SignOutButton() {
  return (<View className='flex flex-1 justify-center items-center'>
    <Button title="Sign out" onPress={onSignOutButtonPress} />
  </View>)
