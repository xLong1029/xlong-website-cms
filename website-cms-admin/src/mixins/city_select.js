/*
 * 模块 : 城市联动选择相关配置
 * 作者 : 罗永梅（381612175@qq.com）
 * 日期 : 2017-10-25
 * 版本 : version 2.0
 */
// Json数据
import JsonCity from '@/mock/city.json'

export default {
	data() {
		return {
            // 城市选项列表
            cityList: [],
		}
    },
    created(){
        this.getCityList();
    },
	methods: {
        // 省市选值
        selectCity(value, selectedData){
            if(selectedData.length <= 0){
                this.infoForm.province = '';
                this.infoForm.city = '';
                this.infoForm.area = '';
            }
            if(selectedData[0]) this.infoForm.province = selectedData[0].value;
            if(selectedData[1]) this.infoForm.city = selectedData[1].value;
            if(selectedData[2]) this.infoForm.area = selectedData[2].value;
        },
        // 获取本地城市列表
        getCityList(){
            this.cityList = JsonCity.map(province => {
                let p = {
                    value: province.name,
                    label: province.name
                };
                p.children = province.childs.map(city => {
                    let c = {
                        value: city.name,
                        label: city.name
                    };
                    c.children = city.childs.map(area => {
                        return {
                            value: area.name,
                            label: area.name
                        };
                    })
                    return c;
                })
                return p;
            });
        }
	}
}