import React, {useEffect, useState} from "react";
import axios from "axios"
import marked from "marked";

import PrimaryLayout from "../../layouts/primaryLayout";

const OrangeTapePage = () => {
    const [data, setData] = useState(null);

    async function getContentData() {
      const res = await axios.get(process.env.GATSBY_CMS_HOST + "/orange-tape/");
      setData(res["data"]);
    }
  
    useEffect(() => {
        getContentData();
    }, []);

    const htmlContent = data ? marked(data.content) : undefined;

    if(!htmlContent) {
        return(
          <PrimaryLayout>Loading...</PrimaryLayout>
        )
    } else {
        return(
            <PrimaryLayout>
                <h1>Orange tape</h1>
                <div
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
            </PrimaryLayout>
        );
    }
}

export default OrangeTapePage;