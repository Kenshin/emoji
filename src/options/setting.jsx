console.log( "=== +emoji options: setting load ===" )

import Button     from 'button';
import * as waves from 'waves';
import * as tt    from 'tooltip';
import Switch     from 'switch';
import TextField  from 'textfield';

export default class Setting extends React.Component {

    render() {
        return (
            <div>
                <Switch width="100%" checked={ false }
                    thumbedColor="#94AC3C" trackedColor="#94AC3C" waves="md-waves-effect"
                    label="Emoji 在复制或插入后是否前后增加一个空格？"
                />
                <Switch width="100%" checked={ false }
                    thumbedColor="#94AC3C" trackedColor="#94AC3C" waves="md-waves-effect"
                    label="插入 emoji 后是否也复制到剪切板？"
                />
                <Switch width="100%" checked={ false }
                    thumbedColor="#94AC3C" trackedColor="#94AC3C" waves="md-waves-effect"
                    label="Popup Tab 栏是否启用点击切换？"
                />
                <TextField 
                    multi={ false }
                    placeholder="插入 emoji 的触发条件默认为 英文/中文 冒号 + 英文/中文 + 空格，例如 ::face 或 ：：笑 "
                />
                <Switch width="100%" checked={ false }
                    thumbedColor="#94AC3C" trackedColor="#94AC3C" waves="md-waves-effect"
                    label="是否开启触发条件高级方式？"
                />
                <TextField 
                    multi={ false }
                    placeholder="仅支持正则表达式。"
                />
                <div className="name">黑名单</div>
                <TextField 
                    multi={ true } rows="5"
                />
            </div>
        )
    }
}