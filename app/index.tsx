import { Pressable, StyleSheet, Text, View } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { useRef, useState } from "react";
import { FFmpegKit, ReturnCode } from "ffmpeg-kit-react-native";
import ViewShot from "react-native-view-shot";
import { ResizeMode, Video } from "expo-av";

export default function IndexPage() {

    const [video, setVideo] = useState<any>(null);
    const [image, setImage] = useState<any>(null);
    const ref = useRef<any>();
    const outputPath = "file:///data/user/0/com.aykutffmpegtest.app/cache/output3.mp4";

    const islem = async () => {
        ref.current.capture().then(uri => {
            setImage(uri);
            console.log(uri)
        })

        FFmpegKit.execute(
            `-i ${video} -i ${image} -b:v 5M -filter_complex "[0:v][1:v] overlay=0:0" -c:v h264 -c:a copy ${outputPath}`
        ).then(async (session) => {
            const returnCode = await session.getReturnCode();
            const output = await session.getOutput();
            console.log(output, "output")

            if (ReturnCode.isSuccess(returnCode)) {
          
              // SUCCESS
              console.log("success")
          
            } else if (ReturnCode.isCancel(returnCode)) {
          
              // CANCEL
              console.log("cancel")
          
            } else {
          
              // ERROR
                console.log("error")
          
            }});
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [16, 9],
          quality: 1,
        });
    
        console.log(result);
    
        if (!result.canceled) {
          setVideo(result.assets[0].uri);
        }
      };

    return (
        <View style={styles.view}>
            
            {/* <ViewShot style={styles.child} ref={ref} options={{format: "png"}}>
                
                <Text>DENEME YAZISI</Text>

            </ViewShot> */}

            <Video
            style={{width: 300, height: 300}}
            source={{uri: outputPath}}
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls
            shouldPlay
            />

            <View style={{flexDirection: "row", gap: 10}}>
                <Pressable style={{borderRadius: 15, backgroundColor: '#c8a7f2', width: 100, height: 35}}
                onPress={pickImage}>
                    <Text>seç</Text>
                </Pressable>
                <Pressable style={{borderRadius: 15, backgroundColor: '#c8a7f2', width: 100, height: 35}}
                onPress={islem}>
                    <Text>bas bana işlem</Text>
                </Pressable>
            </View>
            

        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "#fff",
        flexDirection: "column"
    },
    child: {
        width: "85%",
        height: "85%",
        backgroundColor: "#00000000"
    },
    text: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold"
    }
})