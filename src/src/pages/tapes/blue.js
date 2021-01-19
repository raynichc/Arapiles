import React, {useEffect, useState} from "react";
import axios from "axios"
//import {PageHeader} from "antd";
import marked from "marked";

import Spinner from "../../components/Spinner";
import PrimaryLayout from "../../layouts/primaryLayout";

const BlueTapePage = () => {
    const [data, setData] = useState(null);

    async function getContentData() {
      const res = await axios.get(process.env.GATSBY_CMS_HOST + "/blue-tape/");
      setData(res["data"]);
    }
  
    useEffect(() => {
        getContentData();
    }, []);

    let htmlContent;
    if(data) {
        htmlContent = marked(data.content);
    }

    if(!htmlContent) {
        return(
          <></>
          //<PrimaryLayout><Spinner /></PrimaryLayout>
        )
    } else {
        return(
            <></>
            /*<PrimaryLayout>
                <PageHeader
                    title="Blue Tape"
                    onBack={() => window.history.back()}
                />

                <div
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
            </PrimaryLayout>*/
        );
    }
}

export default BlueTapePage;