/*
  Éles környezet beállításai (ezt használja az `ng build`).

  Fejlesztés közben (`ng serve`) az Angular ezt a fájlt lecseréli az
  environment.development.ts-re – lásd angular.json → fileReplacements.
  Így a kódban mindig ugyanazt importáljuk, és a build dönti el, melyik változat kerül bele.
*/
export const environment = {
  /*
    A Renderre kitelepített backend címe.
    TODO: ha a Render más címet ad (pl. foglalt a név), írd át erre.
  */
  apiUrl: 'https://hajmuvek-api.onrender.com/api',
};
