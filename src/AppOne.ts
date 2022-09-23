import * as BABYLON from "babylonjs";
import AudioMotionAnalyzer from "audiomotion-analyzer";
import { SmoothStepBlock } from "babylonjs";
export class AppOne {
    engine: BABYLON.Engine;
    scene: BABYLON.Scene;

    constructor(readonly canvas: HTMLCanvasElement) {
        this.engine = new BABYLON.Engine(canvas);
        window.addEventListener("resize", () => {
            this.engine.resize();
        });
        this.scene = createScene(this.engine, this.canvas);
    }

    debug(debugOn: boolean = true) {
        if (debugOn) {
            this.scene.debugLayer.show({ overlay: true });
        } else {
            this.scene.debugLayer.hide();
        }
    }

    run() {
        this.debug(false);
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }
}

const createScene = function (
    engine: BABYLON.Engine,
    canvas: HTMLCanvasElement
) {
    // this is the default code from the playground:

    // This creates a basic Babylon Scene object (non-mesh)
    const scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    const camera = new BABYLON.FreeCamera(
        "camera1",
        new BABYLON.Vector3(0, 5, -10),
        scene
    );

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight(
        "light",
        new BABYLON.Vector3(0, 1, 0),
        scene
    );

    light.intensity = 0.7;

    const ground = BABYLON.MeshBuilder.CreateGround(
        "ground",
        { width: 8, height: 8 },
        scene
    );

    //Create dynamic texture
    const textureResolution = 800;

    const textureGround = new BABYLON.DynamicTexture(
        "dynamic texture",
        textureResolution,
        scene
    );

    const textureContext = textureGround.getContext();

    const materialGround = new BABYLON.StandardMaterial("Mat", scene);
    // materialGround.disableLighting = true;
    materialGround.alpha = 0.75;
    materialGround.diffuseColor = BABYLON.Color3.Blue();
    materialGround.emissiveTexture = textureGround;
    ground.material = materialGround;

    let container = document.getElementById("container");

    const audioMotion = new AudioMotionAnalyzer(null, {
        source: document.getElementById("audio") as HTMLMediaElement,
        onCanvasDraw: drawCallback,
        // outlineBars: true,
        // lineWidth: 0.5,
        // showFPS: true,
        radial: true,
        //alphaBars: true,
        useCanvas: true,
        //ledBars: true,
        overlay: true,
        gradient: "classic",
        bgAlpha: 0.5,
        showBgColor: true,
        fillAlpha: 0.5,
        showPeaks: true,
        showScaleX: false,
    });
    console.log(audioMotion);

    audioMotion.width = 800;
    audioMotion.height = 800;

    audioMotion.mode = 3;

    const box = BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, scene);

    box.position.y = 2.25;
    box.position.z = 5.25;
    box.material = materialGround;

    const sphere = BABYLON.MeshBuilder.CreateSphere(
        "sphere",
        { diameter: 3, segments: 32 },
        scene
    );
    sphere.position.y = 3;
    sphere.position.x = -6;
    sphere.rotation.y = BABYLON.Tools.ToRadians(210);
    sphere.rotation.x = BABYLON.Tools.ToRadians(180);
    const spMat = new BABYLON.StandardMaterial("spMat", scene);
    spMat.diffuseColor = BABYLON.Color3.Magenta();
    spMat.emissiveTexture = textureGround;

    sphere.material = spMat;
    box.material = spMat;

    BABYLON.NodeMaterial.ParseFromSnippetAsync("#73IWAR#13", scene).then(
        (nodeMaterial) => {
            let inputBlocks = nodeMaterial.getInputBlocks();
            for (let each in inputBlocks) {
                if (inputBlocks[each].name === "TopLeft") {
                    // console.log(inputBlocks[each]);
                    inputBlocks[each].value.x = 0.15;
                    inputBlocks[each].value.y = 0.3;
                }
                if (inputBlocks[each].name === "OutOfBoundsColor") {
                    //   console.log(inputBlocks[each]);
                    inputBlocks[each].value.r = 0.5;
                    inputBlocks[each].value.g = 0.1;
                    inputBlocks[each].value.b = 1;
                    inputBlocks[each].value.a = 0.8;
                }
            }
            nodeMaterial.wireframe = true;
            sphere.material = nodeMaterial;

            nodeMaterial.getTextureBlocks()[0].texture = textureGround;
        }
    );

    scene.onBeforeRenderObservable.add(function () {
        textureContext.drawImage(audioMotion.canvas, 0, 0);
        textureGround.update();
        sphere.rotation.y += 0.002;
    });

    function drawCallback(instance: any) {
        const ctx = instance.canvasCtx,
            baseSize = (instance.isFullscreen ? 40 : 30) * instance.pixelRatio;

        // use the 'energy' value to increase the font size and make the logo pulse to the beat
        ctx.font = `${
            baseSize + instance.getEnergy() * 25 * instance.pixelRatio
        }px Arial, sans-serif`;

        ctx.fillStyle = "#FFCC00";
        ctx.textAlign = "center";
        ctx.fillText(
            "BabylonPress.org",
            instance.canvas.width - baseSize * 6,
            baseSize * 3
        );
    }

    return scene;
};
