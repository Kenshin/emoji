console.log( "=== +emoji options: setting load ===" )

import * as waves from 'waves';
import * as tt    from 'tooltip';
import Notify     from 'notify';
import Button     from 'button';
import Switch     from 'switch';
import TextField  from 'textfield';

export default class Setting extends React.Component {

    state = {
        error_trigger : "",
        error_regexp  : ""
    };

    onChange( value, key ) {
        this.props.options[key] = value;
        key == "advanced" && this.toggle( value );
    }

    onChangeBlacklist() {
        this.props.options.blacklist = event.target.value.split( "\n" );
    }

    onChangeTrigger( value, key ) {
        try {
            const reg = new RegExp( value );
            this.props.options[key] = value;
            this.setState({
                [ "error_" + key ] : ""
            });
        } catch ( error ) {
            this.setState({
                [ "error_" + key ] : "请输入正确的正则表达式。"
            });
        }
    }

    onClick( type ) {
        console.log( this.props.options )
        if ( type == "set_settings" ) {
            chrome.runtime.sendMessage({ id: type, value: { ...this.props.options } });
            new Notify().Render( "保存成功！" );
        } else {
            new Notify().Render( "snackbar", "是否清除当前数据并初始化？", "确认", ()=>{
                chrome.runtime.sendMessage({ id: type, value: { ...this.props.options } });
                new Notify().Render( "清除成功！" );
            });
        }
    }

    toggle( value ) {
        $( this.refs.regexp ).velocity( value ? "slideDown" : "slideUp" );
    }

    componentDidMount() {
        this.toggle( this.props.options.advanced );
    }

    render() {
        return (
            <div>
                <Switch width="100%" checked={ this.props.options.blank }
                    thumbedColor="#94AC3C" trackedColor="#94AC3C" waves="md-waves-effect"
                    label="在复制或插入 Emoji 时是否前后增加一个空格？"
                    onChange={ (s)=>this.onChange(s, "blank" ) } />
                <Switch width="100%" checked={ this.props.options.clip }
                    thumbedColor="#94AC3C" trackedColor="#94AC3C" waves="md-waves-effect"
                    label="插入 Emoji 后是否也同时复制到剪切板？"
                    onChange={ (s)=>this.onChange(s, "clip" ) } />
                <Switch width="100%" checked={ this.props.options.clicked }
                    thumbedColor="#94AC3C" trackedColor="#94AC3C" waves="md-waves-effect"
                    label="Popup Tab 栏是否启用点击切换？（默认为鼠标悬停切换）"
                    onChange={ (s)=>this.onChange(s, "clicked" ) } />
                <TextField 
                    multi={ false }
                    value={ this.props.options.trigger }
                    errortext={ this.state.error_trigger }
                    placeholder="插入 Emoji 的触发条件，默认为 中英文冒号，仅支持正则表达式"
                    onChange={ (evt)=>this.onChangeTrigger(evt.target.value, "trigger" ) } />
                <Switch width="100%" checked={ this.props.options.advanced }
                    thumbedColor="#94AC3C" trackedColor="#94AC3C" waves="md-waves-effect"
                    label="是否开启触发条件高级模式？（开启后，触发条件将会失效）"
                    onChange={ (s)=>this.onChange(s, "advanced" ) } />
                <div ref="regexp">
                    <TextField 
                        multi={ false }
                        value={ this.props.options.regexp }
                        errortext={ this.state.error_regexp }
                        placeholder="默认为 中英文冒号 + 中英文关键字 + 空格，例如 ::face 或 ：：笑 ，仅支持正则表达式"
                        onChange={ (evt)=>this.onChangeTrigger(evt.target.value, "regexp" ) } />
                </div>
                <div className="name">黑名单</div>
                <TextField 
                    multi={ true } rows="5"
                    value={ this.props.options.blacklist.replace( /,/ig, "\n" ) }
                    onChange={ ()=>this.onChangeBlacklist() } />
                <Button type="raised" text="保存"
                    style={{ "margin": "0" }}
                    color="#fff" backgroundColor="#9E9D24"
                    waves="md-waves-effect md-waves-button"
                    onClick={ ()=>this.onClick( "set_settings" ) } />
                <Button type="raised" text="初始化"
                    style={{ "margin": "10px 0 0" }}
                    color="#fff" backgroundColor="#FF5252"
                    waves="md-waves-effect md-waves-button"
                    onClick={ ()=>this.onClick( "clear_settings" ) } />
            </div>
        )
    }
}