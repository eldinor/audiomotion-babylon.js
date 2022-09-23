import * as BABYLON from "babylonjs";
import AudioMotionAnalyzer from "audiomotion-analyzer";

type amdata = {
    data: any;
};

class audioMotionTexture {
    [x: string]: any;
    constructor(
        name: string,
        resolution: number,
        amwidth: number,
        amheight: number,
        amsource: string,
        amoptions: any,
        scene: BABYLON.Scene,
        callback?: any
    ) {
        const amt = new BABYLON.DynamicTexture(
            name,
            resolution,
            scene
        ) as BABYLON.DynamicTexture & amdata;
        const ctx = amt.getContext();

        const audioMotion = new AudioMotionAnalyzer(undefined, {
            source: document.getElementById(amsource) as HTMLMediaElement,
            //  onCanvasDraw: drawCallback,
            // outlineBars: true,
            //   lineWidth: 0.5,
            // showFPS: true,
            radial: false,
            //alphaBars: true,
            useCanvas: true,
            //ledBars: true,
            overlay: false,
            gradient: "prism",
            bgAlpha: 0.5,
            showBgColor: false,
            fillAlpha: 0.5,
            showPeaks: true,
            showScaleX: false,
        });

        amt.data = audioMotion;

        console.log(amt);

        const ddd = amt.data;

        console.log(ddd);

        let x = audioMotionTexture.prototype;

        console.log(x);

        const amarray = Object.getOwnPropertyNames(amt.data);

        amarray.map((m) => {
            if (!m.includes("_")) {
                console.log(m);
            }
        });

        console.log(amarray);

        audioMotion.width = amwidth;
        audioMotion.height = amheight;
        audioMotion.onCanvasDraw = callback;

        audioMotion.radial = amoptions.radial;
        audioMotion.mode = amoptions.mode;

        //  const {options} = audioMotion

        console.log(audioMotion);

        console.log(audioMotion);

        scene.onBeforeRenderObservable.add(function () {
            ctx.drawImage(audioMotion.canvas, 0, 0);
            amt.update();
        });

        return amt;
    }
}

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

    const ggg = new audioMotionTexture(
        "AMT",
        800,
        800,
        800,
        "audio",
        { radial: false, mode: 5 },
        scene,
        function () {
            //    console.log("callback");
        }
    );

    //   ggg.wAng = BABYLON.Tools.ToRadians(180);

    //   console.log(ggg);

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

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new BABYLON.HemisphericLight(
        "light",
        new BABYLON.Vector3(0, 1, 0),
        scene
    );

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;
    /*
    // Our built-in 'sphere' shape.
    var sphere = BABYLON.MeshBuilder.CreateSphere(
        "sphere",
        { diameter: 2, segments: 32 },
        scene
    );
*/
    // Move the sphere upward 1/2 its height
    // sphere.position.y = 1;

    // Our built-in 'ground' shape.
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
    // textureGround.vOffset = 0.25;

    const textureContext = textureGround.getContext();

    const materialGround = new BABYLON.StandardMaterial("Mat", scene);
    // materialGround.diffuseTexture = textureGround;
    materialGround.alpha = 0.5;
    materialGround.diffuseColor = BABYLON.Color3.Blue();
    (materialGround.emissiveTexture as audioMotionTexture) = ggg;
    //materialGround.opacityTexture = textureGround;
    ground.material = materialGround;

    let container = document.getElementById("container");

    const audioMotion = new AudioMotionAnalyzer(undefined, {
        source: document.getElementById("audio2") as HTMLMediaElement,
        onCanvasDraw: drawCallback,
        // outlineBars: true,
        //   lineWidth: 0.5,
        // showFPS: true,
        radial: false,
        alphaBars: true,
        useCanvas: true,
        //ledBars: true,
        overlay: true,
        gradient: "classic",
        bgAlpha: 0.9,
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
    sphere.position.y = 1;
    sphere.position.x = -6;
    sphere.rotation.y = BABYLON.Tools.ToRadians(210);
    sphere.rotation.x = BABYLON.Tools.ToRadians(180);
    // sphere.material = materialGround;
    const spMat = new BABYLON.StandardMaterial("spMat", scene);
    spMat.diffuseColor = BABYLON.Color3.Magenta();
    spMat.emissiveTexture = textureGround;

    sphere.material = spMat;

    BABYLON.NodeMaterial.ParseFromSnippetAsync("#73IWAR#13", scene).then(
        (nodeMaterial) => {
            let inputBlocks = nodeMaterial.getInputBlocks();
            for (let each in inputBlocks) {
                if (inputBlocks[each].name === "TopLeft") {
                    console.log(inputBlocks[each]);
                    inputBlocks[each].value.x = 0.2;
                    inputBlocks[each].value.y = 0.4;
                }
                if (inputBlocks[each].name === "OutOfBoundsColor") {
                    console.log(inputBlocks[each]);
                    inputBlocks[each].value.r = 0.5;
                    inputBlocks[each].value.g = 0.5;
                    inputBlocks[each].value.b = 1;
                    inputBlocks[each].value.a = 0.5;
                    // inputBlocks[each].value.a = 1;
                }
            }
            sphere.material = nodeMaterial;

            (nodeMaterial.getTextureBlocks()[0].texture as audioMotionTexture) =
                ggg;
        }
    );

    scene.onBeforeRenderObservable.add(function () {
        textureContext.drawImage(audioMotion.canvas, 0, 0);
        textureGround.update();
    });
    /*
    setInterval(() => {
        textureContext.drawImage(audioMotion.canvas, 0, 0);
        textureGround.update();
    }, 50);
*/

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
            "MetaDojo",
            instance.canvas.width - baseSize * 4,
            baseSize * 2
        );
    }

    return scene;
};
