import { Html } from "@react-three/drei";
import * as THREE from "three";
import * as d3 from "d3";

export default function Planet({ planet, userControls, data, KPIsList}) {

    // Get KPI Values
    const getKPIsValues = (KPI) => {
      let arr = [];
      data.forEach((obj) => arr.push(obj[KPI]));
      return arr;
    };

    // Create Scalers for multiple types
    const createScaler = (KPI, type) => {
      let arr = []
      if (type === "distance") { arr = getKPIsValues(KPI).map(i=>Number(i)*-1)}
      else { arr = getKPIsValues(KPI).map(i=>Number(i)) }
      let min = Math.min.apply(Math, arr);
      let max = Math.max.apply(Math, arr);
      const average = (array) => array.reduce((a, b) => a + b) / array.length;
      let mean = average(arr)
      let res = 0;
      if (type === "color") {res = d3.scaleLinear().domain([min,mean,max]).range(["red", "white", "green"]);}
      else if (type === "size") {res = d3.scaleLinear().domain([min, max]).range([0.5, 1.5])}
      else {res = d3.scaleLinear().domain([min, max]).range([2, 20])}
      return res;
    }

    // Create an object that has a scaler for each KPI
    const scalerObj = (type) => {
      let obj = {}
      KPIsList.forEach((kpi) => {
        obj[kpi] = createScaler(kpi, type);
        // "sentiment" needs to be changed if it's called something else in the CSV
        if (type === "color") {obj["sentiment"] = createScaler("sentiment", "color")}
      });
      return obj;
    }

    const distScaler = scalerObj("distance");
    const sizeScaler = scalerObj("size")
    const colorScaler = scalerObj("color");

    // Scale xRadius value and yRadius value
    const xRadius = (distScaler[userControls.distance](planet[userControls.distance]*-1)) + 1.5 * 4
    const zRadius = (distScaler[userControls.distance](planet[userControls.distance]*-1)) + 1.5 * 3

    const size = sizeScaler[userControls.size](planet[userControls.size])
    const color = colorScaler.sentiment(planet.sentiment)
    
  return (
    <>
      <mesh position={[xRadius * Math.sin(planet.offset),0,zRadius * Math.cos(planet.offset)]}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial color={color}/>
        <Html distanceFactor={17}>
          <div className="annotation" style={{ pointerEvents: 'none'}}>{planet.name}</div>
        </Html>
      </mesh>
      <Ecliptic xRadius={xRadius} zRadius={zRadius} style={{ pointerEvents: 'none'}} />
    </>
  );
}



// Create Orbits around each planet
function Ecliptic({ xRadius = 1, zRadius = 1 }) {
  const points = [];
  for (let index = 0; index < 64; index++) {
    const angle = (index / 64) * 2 * Math.PI;
    const x = xRadius * Math.cos(angle);
    const z = zRadius * Math.sin(angle);
    points.push(new THREE.Vector3(x, 0, z));
  }

  points.push(points[0]);

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial attach="material" color="#393e46" linewidth={10} />
    </line>
  );
}