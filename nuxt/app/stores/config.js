import { acceptHMRUpdate, defineStore } from "pinia";
export const useConfigStore = defineStore("config", () => {
  const curSite=ref('porn5fNav')
  const setCurSite=(v)=>{
    curSite.value=v
  }
  const allNav= {
    porn5fNav:[   {
            "text": "男同",
            "href": "/asiangay"
        },
        {
            "text": "女同",
            "href": "/lesbian"
        },
        "VIP熱門",
        "台灣",
        "國產",
        "自拍",
        "偷拍",
        "流出",
        "探花",
        {
            "text": "越南自拍",
            "href": "https://hrt21.com"
        },
        {
            "text": "動漫",
            "href": "/genre"
        },
        "日韓",
        {
            "text": "中國大陸",
            "href": "https://viet123.tv/"
        }
    ],
    genreNav:["裏番","新番預告","泡麵番","Motion Anime","3D動畫","同人作品","Cosplay"],
    lesbianNav:["女女做愛","女同肛交","亞洲女同性戀","女同寶貝","女同性戀群交","異種族女同","日本女同","韓國女同","日本女同"],
    asiangayNav:["網紅","體育生","帥哥","直男","肌肉","大屌","飛機","肛交","按摩","肛交","按摩","群交","伪娘","劇情","直男專訪","極品必看","會員專屬"],
  };
  const curNav=computed(() =>{
     return  allNav[curSite.value]
  })
  return {
    curNav,
    curSite,
    setCurSite,
    allNav
  }
});

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useConfigStore, import.meta.hot));
