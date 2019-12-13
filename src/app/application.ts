import Stats from 'stats.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { AnimationAction } from 'three/src/animation/AnimationAction';
import { Scene, PerspectiveCamera, WebGLRenderer, PlaneBufferGeometry, Mesh, MeshBasicMaterial, DoubleSide, GridHelper, AmbientLight, AnimationMixer, Clock, Raycaster, Vector2, Object3D } from 'three';

export class Application {
  private scene: Scene;
  private clock: Clock;
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  private stats: Stats;
  private gltfLoader: GLTFLoader;
  private walkAction: AnimationAction;
  private animationMixer: AnimationMixer;
  // 动画是否暂停
  private paused: boolean = false;

  constructor() {
    this.scene = new Scene();
    this.clock = new Clock();
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new WebGLRenderer({ antialias: true });
    this.gltfLoader = new GLTFLoader();
    this.animationMixer = new AnimationMixer(this.scene);

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    window.addEventListener('resize', () => this.onWindowResize());

    this.camera.position.set(0, 5, 5);

    this.stats = new Stats();
    this.stats.showPanel(0);
    window.document.body.appendChild(this.stats.dom);

    new OrbitControls(this.camera, this.renderer.domElement);

    const planeBufferGeometry = new PlaneBufferGeometry(100, 100);
    const plane = new Mesh(planeBufferGeometry, new MeshBasicMaterial({ color: 0xFFFFFF, side: DoubleSide }));
    plane.name = 'plane';
    plane.rotation.x = -Math.PI / 2;
    this.scene.add(plane);
    this.scene.add(new GridHelper(100, 100));

    this.gltfLoader.load('../assets/Soldier.glb', gltf => {
      console.log(gltf);
      gltf.scene.name = 'Soldier';
      this.scene.add(gltf.scene);
      this.scene.add(new AmbientLight(0xFFFFFF, 2));

      const animationClip = gltf.animations.find(animationClip => animationClip.name === 'Walk');
      this.walkAction = this.animationMixer.clipAction(animationClip);
      this.walkAction.play();
    });

    this.renderer.domElement.addEventListener('click', event => {
      const { offsetX, offsetY }  = event;
      const x = ( offsetX / window.innerWidth ) * 2 - 1;
    	const y = - ( offsetY / window.innerHeight ) * 2 + 1;
      const mousePoint = new Vector2(x, y);
      const raycaster = new Raycaster();
      // 设置鼠标位置和参考相机
      raycaster.setFromCamera(mousePoint, this.camera);
      // 鼠标点击对应的物体（所有鼠标映射到的物体，包括被遮挡的）
      const intersects =  raycaster.intersectObjects(this.scene.children, true);
      // 过滤网格和地面
      const intersect = intersects.filter(intersect => !(intersect.object instanceof GridHelper) && intersect.object.name !== 'plane')[0];
      if(intersect && this.isClickSoldier(intersect.object)) {
        // 停止动画
        // this.walkAction.stop();
        // 暂停动画
        this.walkAction.paused = !this.walkAction.paused;
      }
    });

    this.render();
  }

  /**
   * 递归判断是否点击到人物
   * @param object
   */
  private isClickSoldier(object: Object3D) {
    if(object.name === 'Soldier') {
      return object;
    } else if(object.parent) {
      return this.isClickSoldier(object.parent);
    } else {
      return null;
    }
  }

  private render() {
    // 更新动画
    this.animationMixer.update(this.clock.getDelta());

    this.renderer.render(this.scene, this.camera);

    window.requestAnimationFrame(() => this.render());
    this.stats.update();
  }

  private onWindowResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

}
