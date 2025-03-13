import BaseMarketingCampaign from "../BaseMarketingCampaign";
import GoldenStickerModal from "./GoldenStickerModal.vue";

export default class GoldenStickersMarketingCampaign extends BaseMarketingCampaign {

    public getHomeComponent() {
        return GoldenStickerModal;
    }

    public hasSeenCampaign() {
        const value = this.getFromLocalStorage("modal:seen");
        return value !== null && value === "true"; 
    }

    public setAsSeen() {
        this.setInLocalStorage("modal:seen", "true");
    }

}