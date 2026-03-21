// 地理知识问答游戏 - 增强版
class GeographyQuiz {
    constructor() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.totalQuestions = 15;
        this.correctAnswers = 0;
        this.streak = 0;
        this.maxStreak = 0;
        this.difficulty = 'easy';
        this.answered = false;
        this.hintUsed = false;
        this.questionIndices = [];
        
        // 扩充的问题库 - 每个难度20道题
        this.questions = {
            easy: [
                {
                    question: "世界上最大的海洋是？",
                    answers: ["太平洋", "大西洋", "印度洋", "北冰洋"],
                    correct: 0,
                    hint: "它的名称和\"平静\"有关",
                    explanation: "太平洋面积约1.65亿平方公里，是世界上最大的海洋，约占地球表面积的三分之一"
                },
                {
                    question: "中国的首都是哪里？",
                    answers: ["上海", "北京", "广州", "深圳"],
                    correct: 1,
                    hint: "这里有天安门广场",
                    explanation: "北京是中华人民共和国的首都，位于华北平原北部，是全国政治、文化中心"
                },
                {
                    question: "世界上最长的河流是？",
                    answers: ["尼罗河", "亚马逊河", "长江", "密西西比河"],
                    correct: 0,
                    hint: "它流经埃及",
                    explanation: "尼罗河全长约6650公里，从南向北流经11个国家，最终注入地中海"
                },
                {
                    question: "澳大利亚的首都是？",
                    answers: ["悉尼", "墨尔本", "堪培拉", "珀斯"],
                    correct: 2,
                    hint: "不是最大的城市",
                    explanation: "堪培拉是澳大利亚的首都，1908年被选定为首都，专门规划建设的政治中心"
                },
                {
                    question: "世界上最高的山峰是？",
                    answers: ["珠穆朗玛峰", "乔戈里峰", "干城章嘉峰", "洛子峰"],
                    correct: 0,
                    hint: "位于中国和尼泊尔边境",
                    explanation: "珠穆朗玛峰海拔8848.86米，位于喜马拉雅山脉，是世界最高峰"
                },
                {
                    question: "日本由多少个主要岛屿组成？",
                    answers: ["2个", "3个", "4个", "5个"],
                    correct: 2,
                    hint: "本州、北海道、九州、四国",
                    explanation: "日本主要由本州、北海道、九州、四国四个大岛组成，还有数千个小岛"
                },
                {
                    question: "撒哈拉沙漠位于哪个大洲？",
                    answers: ["亚洲", "非洲", "欧洲", "南美洲"],
                    correct: 1,
                    hint: "这个大洲被称为'黑大陆'",
                    explanation: "撒哈拉沙漠位于非洲北部，面积约900万平方公里，是世界第三大沙漠"
                },
                {
                    question: "地中海位于哪三个大洲之间？",
                    answers: ["亚洲、非洲、欧洲", "欧洲、非洲、南美洲", "亚洲、欧洲、北美洲", "非洲、南美洲、北美洲"],
                    correct: 0,
                    hint: "古代文明的摇篮地区",
                    explanation: "地中海位于欧洲、非洲和亚洲三大洲之间，是古代文明交流的重要区域"
                },
                {
                    question: "巴西的首都是？",
                    answers: ["里约热内卢", "圣保罗", "巴西利亚", "萨尔瓦多"],
                    correct: 2,
                    hint: "是一个专门建设的新首都",
                    explanation: "巴西利亚是巴西的首都，于1960年建成，是20世纪规划建设的现代化城市"
                },
                {
                    question: "世界上面积最大的国家是？",
                    answers: ["中国", "美国", "俄罗斯", "加拿大"],
                    correct: 2,
                    hint: "横跨欧亚两大洲",
                    explanation: "俄罗斯面积约1707万平方公里，横跨欧亚大陆，是世界面积最大的国家"
                },
                {
                    question: "英国的首都是？",
                    answers: ["曼彻斯特", "伦敦", "利物浦", "爱丁堡"],
                    correct: 1,
                    hint: "这里有大本钟",
                    explanation: "伦敦是英国的首都，也是英格兰的首府，位于泰晤士河畔"
                },
                {
                    question: "世界上最小的大洲是？",
                    answers: ["南极洲", "欧洲", "大洋洲", "南美洲"],
                    correct: 2,
                    hint: "主要由澳大利亚组成",
                    explanation: "大洋洲面积约897万平方公里，是世界上最小的大洲，主要包括澳大利亚和众多岛屿"
                },
                {
                    question: "印度的首都是？",
                    answers: ["孟买", "新德里", "加尔各答", "班加罗尔"],
                    correct: 1,
                    hint: "位于德里地区",
                    explanation: "新德里是印度的首都，位于德里地区南部，是印度的政治和行政中心"
                },
                {
                    question: "亚洲面积最大的国家是？",
                    answers: ["印度", "中国", "俄罗斯", "哈萨克斯坦"],
                    correct: 1,
                    hint: "人口也是最多的",
                    explanation: "中国面积约960万平方公里，是亚洲面积最大的国家，也是世界第三大国"
                },
                {
                    question: "非洲最长的河流是？",
                    answers: ["刚果河", "尼日尔河", "尼罗河", "赞比西河"],
                    correct: 2,
                    hint: "也是世界最长的河流",
                    explanation: "尼罗河是非洲最长的河流，全长约6650公里，被誉为埃及的生命线"
                },
                {
                    question: "南美洲面积最大的国家是？",
                    answers: ["阿根廷", "巴西", "秘鲁", "哥伦比亚"],
                    correct: 1,
                    hint: "说葡萄牙语的国家",
                    explanation: "巴西面积约851万平方公里，是南美洲面积最大的国家，约占南美洲总面积的一半"
                },
                {
                    question: "欧洲最长的河流是？",
                    answers: ["多瑙河", "伏尔加河", "莱茵河", "第聂伯河"],
                    correct: 1,
                    hint: "流入里海",
                    explanation: "伏尔加河全长3690公里，是欧洲最长的河流，被俄国人称为'母亲河'"
                },
                {
                    question: "北美洲最长的河流是？",
                    answers: ["密西西比河", "科罗拉多河", "哥伦比亚河", "育空河"],
                    correct: 0,
                    hint: "流经美国中部",
                    explanation: "密西西比河全长约6020公里，是北美洲最长的河流，被称为美国的'老人河'"
                },
                {
                    question: "世界上最深的湖泊是？",
                    answers: ["苏必利尔湖", "贝加尔湖", "里海", "坦噶尼喀湖"],
                    correct: 1,
                    hint: "位于俄罗斯西伯利亚",
                    explanation: "贝加尔湖最深达1637米，是世界最深的淡水湖，被誉为'西伯利亚明珠'"
                },
                {
                    question: "世界上最大的岛屿是？",
                    answers: ["新几内亚岛", "格陵兰岛", "婆罗洲", "马达加斯加岛"],
                    correct: 1,
                    hint: "属于丹麦",
                    explanation: "格陵兰岛面积约216万平方公里，是世界最大的岛屿，大部分被冰雪覆盖"
                }
            ],
            medium: [
                {
                    question: "安第斯山脉位于哪个大洲？",
                    answers: ["北美洲", "南美洲", "亚洲", "非洲"],
                    correct: 1,
                    hint: "这个大洲形状像一个倒三角",
                    explanation: "安第斯山脉位于南美洲西部，全长约9000公里，是世界最长的山脉"
                },
                {
                    question: "死海位于哪两个国家之间？",
                    answers: ["以色列和约旦", "埃及和苏丹", "伊朗和伊拉克", "土耳其和希腊"],
                    correct: 0,
                    hint: "一个是犹太人的国家",
                    explanation: "死海位于以色列和约旦之间，海拔-430米，是世界最低的湖泊"
                },
                {
                    question: "马达加斯加岛位于哪个大洋？",
                    answers: ["太平洋", "大西洋", "印度洋", "北冰洋"],
                    correct: 2,
                    hint: "非洲东海岸外",
                    explanation: "马达加斯加是位于印度洋西部的岛国，距离非洲东海岸约400公里"
                },
                {
                    question: "世界上最深的海沟是？",
                    answers: ["马里亚纳海沟", "波多黎各海沟", "日本海沟", "千岛海沟"],
                    correct: 0,
                    hint: "位于太平洋西部",
                    explanation: "马里亚纳海沟最深处达11034米，是地球表面最深的地方"
                },
                {
                    question: "亚马逊雨林主要位于哪个国家？",
                    answers: ["阿根廷", "巴西", "哥伦比亚", "委内瑞拉"],
                    correct: 1,
                    hint: "南美洲最大的国家",
                    explanation: "巴西拥有亚马逊雨林约60%的面积，是地球之肺的主要组成部分"
                },
                {
                    question: "苏伊士运河连接哪两个海？",
                    answers: ["地中海和红海", "黑海和地中海", "红海和阿拉伯海", "地中海和大西洋"],
                    correct: 0,
                    hint: "一个在北，一个在南",
                    explanation: "苏伊士运河连接地中海和红海，长约193公里，是重要的国际航运通道"
                },
                {
                    question: "喜马拉雅山脉分隔哪两个国家？",
                    answers: ["中国和印度", "印度和巴基斯坦", "中国和尼泊尔", "印度和孟加拉国"],
                    correct: 0,
                    hint: "世界两个人口最多的国家",
                    explanation: "喜马拉雅山脉是中国和印度的天然边界，包含世界最高峰珠穆朗玛峰"
                },
                {
                    question: "格陵兰岛属于哪个国家？",
                    answers: ["冰岛", "挪威", "丹麦", "加拿大"],
                    correct: 2,
                    hint: "一个欧洲小国",
                    explanation: "格陵兰岛是丹麦的自治领土，拥有高度的内政自治权"
                },
                {
                    question: "巴拿马运河连接哪两个大洋？",
                    answers: ["太平洋和大西洋", "太平洋和印度洋", "大西洋和印度洋", "大西洋和北冰洋"],
                    correct: 0,
                    hint: "世界两个最大的海洋",
                    explanation: "巴拿马运河连接太平洋和大西洋，长约81公里，极大地缩短了航运距离"
                },
                {
                    question: "乞力马扎罗山位于哪个国家？",
                    answers: ["肯尼亚", "坦桑尼亚", "乌干达", "埃塞俄比亚"],
                    correct: 1,
                    hint: "非洲东部的一个国家",
                    explanation: "乞力马扎罗山是坦桑尼亚的最高峰，海拔5895米，也是非洲最高峰"
                },
                {
                    question: "维多利亚瀑布位于哪两个国家之间？",
                    answers: ["赞比亚和津巴布韦", "南非和博茨瓦纳", "肯尼亚和坦桑尼亚", "埃及和苏丹"],
                    correct: 0,
                    hint: "南部非洲两个内陆国家",
                    explanation: "维多利亚瀑布位于赞比亚和津巴布韦边界的赞比西河上，是世界三大瀑布之一"
                },
                {
                    question: "土耳其海峡包括哪两个海峡？",
                    answers: ["博斯普鲁斯海峡和达达尼尔海峡", "直布罗陀海峡和英吉利海峡", "白令海峡和德雷克海峡", "马六甲海峡和霍尔木兹海峡"],
                    correct: 0,
                    hint: "连接黑海和地中海",
                    explanation: "土耳其海峡由博斯普鲁斯海峡和达达尼尔海峡组成，连接黑海和地中海"
                },
                {
                    question: "世界上最大的内陆国是？",
                    answers: ["蒙古", "哈萨克斯坦", "阿富汗", "乍得"],
                    correct: 1,
                    hint: "位于中亚",
                    explanation: "哈萨克斯坦面积约272万平方公里，是世界上最大的内陆国"
                },
                {
                    question: "尼亚加拉瀑布位于哪两个国家之间？",
                    answers: ["美国和加拿大", "美国和墨西哥", "加拿大和格陵兰", "美国和古巴"],
                    correct: 0,
                    hint: "北美洲两个邻国",
                    explanation: "尼亚加拉瀑布位于美国和加拿大边界，是北美洲最著名的瀑布"
                },
                {
                    question: "地中海最大的岛屿是？",
                    answers: ["撒丁岛", "西西里岛", "科西嘉岛", "塞浦路斯"],
                    correct: 1,
                    hint: "属于意大利",
                    explanation: "西西里岛面积约2.5万平方公里，是地中海最大的岛屿，属于意大利"
                },
                {
                    question: "世界上最长的海岸线属于哪个国家？",
                    answers: ["俄罗斯", "加拿大", "澳大利亚", "挪威"],
                    correct: 1,
                    hint: "北美洲的国家",
                    explanation: "加拿大海岸线长约20万公里，是世界上海岸线最长的国家"
                },
                {
                    question: "阿尔卑斯山脉主要位于哪个大洲？",
                    answers: ["亚洲", "非洲", "欧洲", "北美洲"],
                    correct: 2,
                    hint: "跨越多个欧洲国家",
                    explanation: "阿尔卑斯山脉位于欧洲中部，跨越8个国家，是欧洲最重要的山脉"
                },
                {
                    question: "世界上最大的三角洲是？",
                    answers: ["尼罗河三角洲", "密西西比河三角洲", "恒河三角洲", "湄公河三角洲"],
                    correct: 2,
                    hint: "位于孟加拉湾",
                    explanation: "恒河三角洲面积约10万平方公里，是世界最大的三角洲，主要在孟加拉国境内"
                },
                {
                    question: "世界上最大的咸水湖是？",
                    answers: ["死海", "咸海", "里海", "大盐湖"],
                    correct: 2,
                    hint: "实际上是一个湖泊",
                    explanation: "里海面积约37万平方公里，虽然名为海，实际是世界最大的内陆咸水湖"
                },
                {
                    question: "世界上最大的半岛是？",
                    answers: ["阿拉伯半岛", "印度半岛", "斯堪的纳维亚半岛", "伊比利亚半岛"],
                    correct: 0,
                    hint: "位于亚洲西南部",
                    explanation: "阿拉伯半岛面积约322万平方公里，是世界最大的半岛，大部分为沙漠"
                }
            ],
            hard: [
                {
                    question: "世界上最小的国家梵蒂冈的面积约为？",
                    answers: ["0.17平方公里", "0.44平方公里", "1.2平方公里", "2.1平方公里"],
                    correct: 1,
                    hint: "不到半平方公里",
                    explanation: "梵蒂冈面积约0.44平方公里，人口约800人，是世界最小的主权国家"
                },
                {
                    question: "马尔代夫由多少个珊瑚岛组成？",
                    answers: ["约200个", "约500个", "约1200个", "约2000个"],
                    correct: 2,
                    hint: "超过一千个",
                    explanation: "马尔代夫由约1200个珊瑚岛组成，其中约200个有人居住，是著名的旅游胜地"
                },
                {
                    question: "世界上最大的内陆湖是？",
                    answers: ["里海", "咸海", "贝加尔湖", "死海"],
                    correct: 0,
                    hint: "严格意义上它是一个湖",
                    explanation: "里海面积约37万平方公里，虽名为海，实际是世界最大的湖泊"
                },
                {
                    question: "南极洲的面积约占地球陆地面积的？",
                    answers: ["5%", "9%", "12%", "15%"],
                    correct: 1,
                    hint: "接近十分之一",
                    explanation: "南极洲面积约1400万平方公里，占地球陆地面积约9.4%"
                },
                {
                    question: "世界上最长的山脉是？",
                    answers: ["喜马拉雅山脉", "安第斯山脉", "阿尔卑斯山脉", "洛矶山脉"],
                    correct: 1,
                    hint: "在南美洲",
                    explanation: "安第斯山脉长约9000公里，是世界最长的山脉，被称为'南美洲的脊梁'"
                },
                {
                    question: "地球上最干燥的地方阿塔卡马沙漠位于？",
                    answers: ["秘鲁", "智利", "玻利维亚", "阿根廷"],
                    correct: 1,
                    hint: "南美洲西海岸的狭长国家",
                    explanation: "阿塔卡马沙漠位于智利北部，年降水量不足1毫米，是世界最干燥的地区"
                },
                {
                    question: "世界上最大的珊瑚礁系统大堡礁位于？",
                    answers: ["印度尼西亚", "菲律宾", "澳大利亚", "马来西亚"],
                    correct: 2,
                    hint: "南半球的岛屿大国",
                    explanation: "大堡礁位于澳大利亚东北海岸，长约2300公里，是世界最大的珊瑚礁系统"
                },
                {
                    question: "世界上最大的淡水湖是？",
                    answers: ["苏必利尔湖", "贝加尔湖", "里海", "维多利亚湖"],
                    correct: 0,
                    hint: "位于北美洲",
                    explanation: "苏必利尔湖面积约8.2万平方公里，是世界最大的淡水湖，位于美加边境"
                },
                {
                    question: "世界上人口密度最高的国家是？",
                    answers: ["新加坡", "摩纳哥", "香港", "梵蒂冈"],
                    correct: 1,
                    hint: "欧洲的一个城邦国家",
                    explanation: "摩纳哥人口密度约每平方公里26000人，是世界人口密度最高的国家"
                },
                {
                    question: "世界上海拔最高的首都是？",
                    answers: ["拉萨", "拉巴斯", "基多", "亚的斯亚贝巴"],
                    correct: 1,
                    hint: "南美洲的首都",
                    explanation: "拉巴斯是玻利维亚的政府所在地，海拔约3500米，是世界海拔最高的首都"
                },
                {
                    question: "世界上最深的峡谷是？",
                    answers: ["科罗拉多大峡谷", "雅鲁藏布大峡谷", "安塔洛峡谷", "虎跳峡"],
                    correct: 1,
                    hint: "位于中国西藏",
                    explanation: "雅鲁藏布大峡谷最深处达6009米，是世界最深的峡谷"
                },
                {
                    question: "世界上最大的群岛国家是？",
                    answers: ["菲律宾", "印度尼西亚", "日本", "马来西亚"],
                    correct: 1,
                    hint: "拥有超过17000个岛屿",
                    explanation: "印度尼西亚由约17508个岛屿组成，是世界最大的群岛国家"
                },
                {
                    question: "世界上最长的地下河是？",
                    answers: ["圣保罗地下河", "普埃尔托普林塞萨地下河", "马穆斯洞穴系统", "风洞"],
                    correct: 1,
                    hint: "位于菲律宾",
                    explanation: "普埃尔托普林塞萨地下河位于菲律宾巴拉望岛，长约8.2公里，是世界最长的地下河"
                },
                {
                    question: "世界上最高的高原是？",
                    answers: ["青藏高原", "阿尔蒂普拉诺高原", "埃塞俄比亚高原", "蒙古高原"],
                    correct: 0,
                    hint: "被称为'世界屋脊'",
                    explanation: "青藏高原平均海拔4000米以上，面积约250万平方公里，被誉为'世界屋脊'"
                },
                {
                    question: "世界上最大的火山口湖是？",
                    answers: ["火山口湖", "托巴湖", "马萨亚湖", "阿塔卡马湖"],
                    correct: 1,
                    hint: "位于印度尼西亚",
                    explanation: "托巴湖位于印度尼西亚苏门答腊岛，面积约1130平方公里，是世界最大的火山口湖"
                },
                {
                    question: "世界上最大的盐湖是？",
                    answers: ["死海", "乌尤尼盐湖", "大盐湖", "卡拉库尔湖"],
                    correct: 1,
                    hint: "位于南美洲",
                    explanation: "乌尤尼盐湖位于玻利维亚，面积约1万平方公里，是世界最大的盐湖"
                },
                {
                    question: "世界上最长的洞穴系统是？",
                    answers: ["猛犸洞", "风洞", "卡尔斯巴德洞穴", "韩松洞"],
                    correct: 0,
                    hint: "位于美国肯塔基州",
                    explanation: "猛犸洞位于美国肯塔基州，已探明长度超过640公里，是世界最长的洞穴系统"
                },
                {
                    question: "世界上最大的热带雨林是？",
                    answers: ["亚马逊雨林", "刚果雨林", "东南亚雨林", "澳大利亚雨林"],
                    correct: 0,
                    hint: "被称为'地球之肺'",
                    explanation: "亚马逊雨林面积约550万平方公里，是世界最大的热带雨林，被誉为'地球之肺'"
                },
                {
                    question: "世界上最深的海是？",
                    answers: ["地中海", "红海", "加勒比海", "菲律宾海"],
                    correct: 3,
                    hint: "位于太平洋西部",
                    explanation: "菲律宾海最深处达10540米，是世界最深的海，包含马里亚纳海沟"
                },
                {
                    question: "世界上最大的沙漠是？",
                    answers: ["撒哈拉沙漠", "阿拉伯沙漠", "戈壁沙漠", "南极沙漠"],
                    correct: 3,
                    hint: "不是热带沙漠",
                    explanation: "南极洲是世界最大的沙漠，面积约1400万平方公里，属于寒带沙漠"
                }
            ]
        };
        
        this.bindEvents();
        this.updateUI();
        this.createParticles();
    }

    createParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        document.body.appendChild(particlesContainer);

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (3 + Math.random() * 3) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    bindEvents() {
        document.getElementById('startButton').addEventListener('click', () => {
            this.startQuiz();
        });

        document.getElementById('nextButton').addEventListener('click', () => {
            this.nextQuestion();
        });

        document.getElementById('restartButton').addEventListener('click', () => {
            this.restartQuiz();
        });

        document.getElementById('hintButton').addEventListener('click', () => {
            this.showHint();
        });

        document.querySelectorAll('.difficulty-button').forEach(button => {
            button.addEventListener('click', (e) => {
                this.setDifficulty(e.target.dataset.level);
            });
        });
    }

    setDifficulty(level) {
        this.difficulty = level;
        document.querySelectorAll('.difficulty-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-level="${level}\"]`).classList.add('active');
    }

    startQuiz() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.streak = 0;
        this.maxStreak = 0;
        this.generateQuestionIndices();
        this.showQuestion();
        
        document.getElementById('startButton').style.display = 'none';
        document.getElementById('hintButton').style.display = 'inline-block';
        
        this.updateUI();
    }

    generateQuestionIndices() {
        const questions = this.questions[this.difficulty];
        const indices = [];
        
        // 创建问题索引数组
        for (let i = 0; i < questions.length; i++) {
            indices.push(i);
        }
        
        // 洗牌算法随机排序
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        
        // 取前totalQuestions个作为本次问题
        this.questionIndices = indices.slice(0, this.totalQuestions);
    }

    showQuestion() {
        if (this.currentQuestionIndex >= this.totalQuestions) {
            this.endQuiz();
            return;
        }

        const questionIndex = this.questionIndices[this.currentQuestionIndex];
        const question = this.questions[this.difficulty][questionIndex];
        
        document.getElementById('questionNumber').textContent = `问题 ${this.currentQuestionIndex + 1}`;
        document.getElementById('questionText').textContent = question.question;
        
        this.answered = false;
        this.hintUsed = false;
        document.getElementById('hintBox').classList.remove('show');
        document.getElementById('nextButton').style.display = 'none';
        document.getElementById('hintButton').style.display = 'inline-block';
        
        // 清除之前的解释
        const existingExplanation = document.querySelector('.explanation');
        if (existingExplanation) {
            existingExplanation.remove();
        }
        
        this.renderAnswers(question);
        this.updateProgress();
        this.updateUI();
    }

    renderAnswers(question) {
        const grid = document.getElementById('answersGrid');
        grid.innerHTML = '';
        
        question.answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.className = 'answer-button';
            button.textContent = answer;
            button.addEventListener('click', () => this.selectAnswer(index));
            grid.appendChild(button);
        });
    }

    selectAnswer(selectedIndex) {
        if (this.answered) return;
        
        this.answered = true;
        const questionIndex = this.questionIndices[this.currentQuestionIndex];
        const question = this.questions[this.difficulty][questionIndex];
        const buttons = document.querySelectorAll('.answer-button');
        
        buttons.forEach((button, index) => {
            button.disabled = true;
            if (index === question.correct) {
                button.classList.add('correct');
            } else if (index === selectedIndex && index !== question.correct) {
                button.classList.add('wrong');
            }
        });

        if (selectedIndex === question.correct) {
            this.correctAnswers++;
            this.streak++;
            this.maxStreak = Math.max(this.maxStreak, this.streak);
            
            // 计分系统：基础分 + 难度加成 + 连击加成 - 提示扣分
            let points = 10;
            if (this.difficulty === 'medium') points = 15;
            if (this.difficulty === 'hard') points = 20;
            
            // 连击加成
            if (this.streak >= 5) points += 10;
            else if (this.streak >= 3) points += 5;
            
            // 提示扣分
            if (this.hintUsed) points = Math.floor(points / 2);
            
            this.score += points;
            this.showMessage(`🎉 正确！+${points}分 ${this.streak > 1 ? `(连击x${this.streak})` : ''}`, 'correct');
        } else {
            this.streak = 0;
            this.showMessage(`❌ 错误！正确答案是：${question.answers[question.correct]}`, 'wrong');
        }

        setTimeout(() => {
            this.showExplanation(question.explanation);
            document.getElementById('nextButton').style.display = 'inline-block';
            document.getElementById('hintButton').style.display = 'none';
        }, 1500);

        this.updateUI();
    }

    showExplanation(explanation) {
        const explanationDiv = document.createElement('div');
        explanationDiv.className = 'explanation';
        explanationDiv.innerHTML = `💡 <strong>知识点：</strong>${explanation}`;
        document.getElementById('questionCard').appendChild(explanationDiv);
    }

    showHint() {
        if (this.answered || this.hintUsed) return;
        
        this.hintUsed = true;
        const questionIndex = this.questionIndices[this.currentQuestionIndex];
        const question = this.questions[this.difficulty][questionIndex];
        document.getElementById('hintText').textContent = question.hint;
        document.getElementById('hintBox').classList.add('show');
        document.getElementById('hintButton').style.display = 'none';
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        this.hideMessage();
        
        // 清除解释
        const explanation = document.querySelector('.explanation');
        if (explanation) {
            explanation.remove();
        }
        
        this.showQuestion();
    }

    endQuiz() {
        const accuracy = Math.round((this.correctAnswers / this.totalQuestions) * 100);
        let grade = '';
        let badgeClass = '';
        
        if (accuracy >= 90) {
            grade = '🏆 地理专家！完美表现！';
            badgeClass = 'expert';
        } else if (accuracy >= 75) {
            grade = '🌟 地理达人！表现优秀！';
            badgeClass = 'expert';
        } else if (accuracy >= 60) {
            grade = '👍 不错的表现！继续努力！';
            badgeClass = 'good';
        } else if (accuracy >= 40) {
            grade = '📚 还需努力！多加练习！';
            badgeClass = 'average';
        } else {
            grade = '💪 重新挑战！相信你能行！';
            badgeClass = 'average';
        }

        const difficultyText = {
            'easy': '简单',
            'medium': '中等', 
            'hard': '困难'
        };

        const messageContent = `
            🎊 测试完成！<br><br>
            📊 <strong>成绩统计</strong><br>
            难度等级：${difficultyText[this.difficulty]}<br>
            得分：${this.score}分<br>
            正确率：${accuracy}%<br>
            最高连击：${this.maxStreak}题<br><br>
            <span class="achievement-badge ${badgeClass}">${grade}</span>
        `;

        document.getElementById('message').innerHTML = messageContent;
        document.getElementById('message').className = 'message final show';
        
        document.getElementById('nextButton').style.display = 'none';
        document.getElementById('hintButton').style.display = 'none';
        document.getElementById('restartButton').style.display = 'inline-block';
    }

    restartQuiz() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.streak = 0;
        this.maxStreak = 0;
        this.answered = false;
        this.questionIndices = [];
        
        document.getElementById('questionNumber').textContent = '问题 1';
        document.getElementById('questionText').textContent = '准备开始地理知识问答！选择难度后点击开始按钮。';
        document.getElementById('answersGrid').innerHTML = '';
        document.getElementById('startButton').style.display = 'inline-block';
        document.getElementById('restartButton').style.display = 'none';
        document.getElementById('hintButton').style.display = 'none';
        document.getElementById('nextButton').style.display = 'none';
        
        // 清除解释
        const explanation = document.querySelector('.explanation');
        if (explanation) {
            explanation.remove();
        }
        
        this.hideMessage();
        this.updateUI();
        this.updateProgress();
    }

    updateProgress() {
        const progress = (this.currentQuestionIndex / this.totalQuestions) * 100;
        document.getElementById('progressFill').style.width = progress + '%';
    }

    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('currentQuestion').textContent = this.currentQuestionIndex + 1;
        document.getElementById('streak').textContent = this.streak;
        
        if (this.currentQuestionIndex > 0) {
            const accuracy = Math.round((this.correctAnswers / this.currentQuestionIndex) * 100);
            document.getElementById('accuracy').textContent = accuracy + '%';
        } else {
            document.getElementById('accuracy').textContent = '0%';
        }
    }

    showMessage(text, type) {
        const message = document.getElementById('message');
        message.innerHTML = text;
        message.className = `message ${type} show`;
    }

    hideMessage() {
        const message = document.getElementById('message');
        message.classList.remove('show');
    }
}

// 启动游戏
window.addEventListener('load', () => {
    new GeographyQuiz();
});