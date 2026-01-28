import { supabase } from "@/lib/supabase";
import { TouchableOpacity,Image, Text } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import {makeRedirectUri} from "expo-auth-session"


const redirectTo= makeRedirectUri();
console.log(redirectTo);

function GoogleSignInButtonUi(operation: ()=>void){
  return (
  <TouchableOpacity
      onPress={operation}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#dbdbdb',
        borderRadius: 4,
        paddingVertical: 10,
        paddingHorizontal: 15,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2, // For Android shadow
      }}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
        style={{ width: 24, height: 24, marginRight: 10 }}
      />
      <Text
        style={{
          fontSize: 16,
          color: '#757575',
          fontFamily: 'Roboto-Regular', // Assuming Roboto is available; install via expo-google-fonts or similar if needed
          fontWeight: '500',
        }}
      >
        Sign in with Google
      </Text>
    </TouchableOpacity>
)

}


export default function GoogleSignInButton(){
  function extractParamsFromUrl(url: string){
    const parsedUrl = new URL(url);
    const hash = parsedUrl.hash.substring(1);
    const params = new URLSearchParams(hash);
    return {
      access_token: params.get("access_token"),
      refresh_token: params.get("refresh_token")
    }
  }




  async function onClick(){
    const {data , error} = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: { prompt: "consent" },
      }
    })

    const url = data.url;
    if (!url) {
      console.error("no oauth url found!");
      return;
    }

    const result = await WebBrowser.openAuthSessionAsync(
      url,
      redirectTo,
    ).catch((error)=>{
      console.log(error)
    })

    console.debug('onSignInButtonPress - openAuthSessionAsync - result', { result });

    if(result && result.type === "success"){
      const params = extractParamsFromUrl(result.url);
      console.log(params);
      if(params.access_token && params.refresh_token){
        const {data, error} = await supabase.auth.setSession({
          access_token: params.access_token,
          refresh_token: params.refresh_token
        })
      } else{
        console.error('onSignInButtonPress - setSession - failed');

      }
    } else{
      console.error('onSignInButtonPress - openAuthSessionAsync - failed');
    }
  }

  useEffect(() => {
    WebBrowser.warmUpAsync();
    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  return GoogleSignInButtonUi(onClick);

}

