import {Suspense, useState, useEffect} from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import "../styles.css";
import * as dat from "dat.gui";
import Sun from './Sun'
import Planet from './Planet'


export default function Graph({data, KPIsList, topicName}) {

      // GUI Panel Controls
      const [userControls, setUserControls] = useState({
        distance: KPIsList[0],
        size: KPIsList[0]
      });
    
      useEffect(() => {
        const gui = new dat.GUI();
    
        gui
          .add(userControls, "distance", KPIsList)
          .name("Distance")
          .onChange(() => {
            setUserControls((prevState) => ({ ...prevState, distance: userControls.distance }));
          });
    
        gui
          .add(userControls, "size", KPIsList)
          .name("Size")
          .onChange(() => {
            setUserControls((prevState) => ({ ...prevState, size: userControls.size }));
          });
    
      }, []);
    


    
  return (
    <>
      <Canvas camera={{ position: [0, 20, 25], fov: 45 }}>
      <Suspense fallback={null}>
          <Sun topicName = {topicName}/>
          {data.map((planet) => (
            <Planet
              planet={planet}
              key={planet.id}
              userControls = {userControls}
              KPIsList = {KPIsList}
              data = {data}
            />
          ))}
          <Lights />
          <OrbitControls />
        </Suspense>
      </Canvas>
    </>
  );
}


function Lights() {
  return (
    <>
      <ambientLight />
      <pointLight position={[0, 0, 0]} />
    </>
  );
}


