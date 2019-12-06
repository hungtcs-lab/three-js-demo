import Stats from 'stats.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh, TextureLoader, DoubleSide } from 'three';

export class Application {
  private scene: Scene;
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  private stats: Stats;

  constructor() {
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    window.addEventListener('resize', () => this.onWindowResize());

    const textureLoader = new TextureLoader();

    const boxTexture = textureLoader.load('./assets/box.jpg');

    const boxGeometry = new BoxGeometry(1, 1, 1);
    const meshBasicMaterial = new MeshBasicMaterial({ map: boxTexture, side: DoubleSide });
    const mesh = new Mesh(boxGeometry, meshBasicMaterial);
    mesh.name = 'box';

    const skyboxGeometry = new BoxGeometry(200, 200, 200);
    const skyboxMaterials = [
      new MeshBasicMaterial({ map: textureLoader.load('./assets/skybox/rt.png'), side: DoubleSide }),
      new MeshBasicMaterial({ map: textureLoader.load('./assets/skybox/lf.png'), side: DoubleSide }),
      new MeshBasicMaterial({ map: textureLoader.load('./assets/skybox/up.png'), side: DoubleSide }),
      new MeshBasicMaterial({ map: textureLoader.load('./assets/skybox/dn.png'), side: DoubleSide }),
      new MeshBasicMaterial({ map: textureLoader.load('./assets/skybox/bk.png'), side: DoubleSide }),
      new MeshBasicMaterial({ map: textureLoader.load('./assets/skybox/ft.png'), side: DoubleSide }),
    ];
    const skyboxMesh = new Mesh(skyboxGeometry, skyboxMaterials);
    skyboxMesh.name = 'skyboxMesh';

    this.camera.position.set(0, 0, 5);

    this.scene.add(mesh);
    this.scene.add(skyboxMesh);

    this.stats = new Stats();
    this.stats.showPanel(0);
    window.document.body.appendChild(this.stats.dom);

    new OrbitControls(this.camera, this.renderer.domElement);

    this.render();
  }

  private render() {
    this.stats.begin();
    window.requestAnimationFrame(() => this.render());
    const skyboxMesh = this.scene.getObjectByName('skyboxMesh');

    skyboxMesh.rotation.y += 0.001;

    this.renderer.render(this.scene, this.camera);
    this.stats.end();
  }

  private onWindowResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

}
