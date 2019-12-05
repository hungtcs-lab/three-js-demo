
export class Application {

  public hello() {
    console.log(
      `%chello %cworld %c!`,
      'color: red; background: lightblue; padding: 0.5rem; font-size: 14px; font-weight: bold;',
      'color: lightblue; background: red; padding: 0.5rem; font-size: 14px; font-weight: bold;',
      'color: white; background: darkgreen; padding: 0.5rem; font-size: 14px; font-weight: bold;',
    );
  }

}
