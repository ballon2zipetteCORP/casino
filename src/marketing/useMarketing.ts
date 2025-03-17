import type BaseMarketingCampaign from "./BaseMarketingCampaign"
import GoldenStickersMarketingCampaign from "./goldenSticker/GoldenStickersMarketingCampaign";

const useMarketing = () => {

    const getCurrentCampaign = <T = BaseMarketingCampaign>(): T|null => {
        return  new GoldenStickersMarketingCampaign({
            campaignName: "B2Z Golden sticker"
        }) as T
    }

    return {
        getCurrentCampaign
    }

}

export default useMarketing;